class City {
    constructor(cityObjects) {
        this.cityObjects = cityObjects;
        this.connections = [];
    }

    addCityObject(cityObject) {
        this.cityObjects.push(cityObject);
    }

    /**
     * Adds a city object.
     * If it is a Node, it seeks the nearest two city objects and places itself in
     * between the objects. If it is a House, it connects to the nearest
     * node.
     * @param {*} cityObject the city object to be added.
     */
    addConnectedCityObject(cityObject) {
        if(cityObject instanceof Node) {
            const sortedByDist = Array.from(this.cityObjects, o => {
                return {
                    dist: o.pos.dist(cityObject.pos),
                    obj: o,
                }
            })
            sortedByDist.sort((a, b) => a.dist - b.dist);
            sortedByDist.reverse();

            // index 0 and 1 are the targets
            // first, clear their connection (if there is one)
            // then add the new connections and the node

            this.disconnect(sortedByDist[0].obj, sortedByDist[1].obj)

            this.addCityObject(cityObject)
            this.connect(sortedByDist[0].obj, cityObject)
            this.connect(sortedByDist[1].obj, cityObject)

        } else if (cityObject instanceof Consumer) {
            const node = this.cityObjects.find(o => o instanceof Node)
            this.addCityObject(cityObject)
            this.connect(node, cityObject)
        } else {
            throw Error("Not a city object")
        }
    }

    /**
     * Adds a connection between two nodes.
     * a and b must be city objects, not indices.
     * @param {*} a first node
     * @param {*} b second node
     */
    connect(a, b) {
        let aIndex = this.cityObjects.indexOf(a);
        let bIndex = this.cityObjects.indexOf(b);
        this.connections.push([aIndex, bIndex]);
    }

    /**
     * Clear any connection between the two nodes.
     * Does nothing if no connections exists.
     * @param {*} a one part of the connection
     * @param {*} b the other part of the connection
     */
    disconnect(a, b) {
        let aIndex = this.cityObjects.indexOf(a);
        let bIndex = this.cityObjects.indexOf(b);
        let cIndex = this.connections.findIndex(c => c == [aIndex, bIndex] || c == [bIndex, aIndex])
        this.connections.splice(cIndex, 1)
    }

    draw(ctx) {
        this.connections.forEach(connection => {
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            let a = this.cityObjects[connection[0]];
            let b = this.cityObjects[connection[1]];
            ctx.moveTo(a.pos.x, a.pos.y);
            ctx.lineTo(b.pos.x, b.pos.y);
            ctx.stroke();
        });
        this.cityObjects.forEach(cityObject => {
            cityObject.draw(ctx);
        });
    }

    /**
     * The fitness is calculated by adding the lengths of all connections.
     */
    getFitness() {
        return this.connections.reduce((acc, connection) => {
            const a = this.cityObjects[connection[0]]
            const b = this.cityObjects[connection[1]]
            return acc + a.pos.dist(b.pos)
        }, 0)
    }

    /**
     * Mutate a City. Currently only moves around the nodes by chance.
     * @param {*} mutationRate the chance that a city can mutate
     * @param {*} maxDist the maximal move delta of a node in x or y direction
     */
    mutateNodes(mutationRate, maxDist) {
        this.cityObjects.map(cityObject => {
            if(cityObject instanceof Node && Math.random() < mutationRate) {
                cityObject.moveRandomly(maxDist)
            }
            return Object.assign(Object.create(Object.getPrototypeOf(cityObject)), cityObject);
        }); 
    }

    /**
     * Make an exact copy of this city.
     * Important: the connections are not cloned, but the nodes.
     */
    clone() {
        const c = new City(Array.from(this.cityObjects, o => o.clone()))
        c.connections = this.connections
        return c
    }
}