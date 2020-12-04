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
        /*if(cityObject instanceof Node) { // doesn't work
            // get the nearest Node
            // get the nearest Consumer
            // break a mybe existing connection
            // make two new ones

            const node = this.cityObjects.reduce((acc, obj) => {
                if (obj instanceof Node) {
                    const dist = obj.pos.dist(cityObject.pos)
                    if (dist < acc.dist) {
                        acc = { dist, obj }
                    }
                }
                return acc
            }, { dist: +Infinity, obj: undefined }).obj

            const target = this.cityObjects.reduce((acc, obj) => {
                if(obj != node) {
                    const dist = obj.pos.dist(cityObject.pos)
                    if (dist < acc.dist) {
                        acc = { dist, obj }
                    }
                }
                return acc
            }, { dist: +Infinity, obj: undefined }).obj

            this.disconnect(target, node)

            this.addCityObject(cityObject)
            this.connect(target, cityObject)
            this.connect(node, cityObject)

        }*/
        if (cityObject instanceof Consumer) {
            // get the neares node
            const node = this.cityObjects.reduce((acc, obj) => {
                if(obj instanceof Node) {
                    const dist = obj.pos.dist(cityObject.pos)
                    if(dist < acc.dist) {
                        acc = {dist, obj}
                    }
                }
                return acc
            }, {dist: +Infinity, obj: undefined}).obj

            // add the city object
            this.addCityObject(cityObject)
            if(node) {
                // if the node was found, add the connection
                this.connect(node, cityObject)
                console.log(this)
            }
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
     * Clear any connection between two nodes.
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
    mutate(mutationRate, maxDist) {
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

    /**
     * Clones the data from the other city into this one.
     * Reuses memory.
     * @param {*} other the city that should be copied into this city.
     */
    cloneFrom(other) {
        this.cityObjects = Array.from(other.cityObjects, o => o.clone())
        this.connections = other.connections
    }
}