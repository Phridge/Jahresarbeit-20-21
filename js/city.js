class City {
    constructor(cityObjects) {
        this.cityObjects = cityObjects;
        this.conntections = [];
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
                const dx = o.x - cityObject.x
                const dy = o.y - cityObject.y
                return {
                    dist: Math.sqrt(dx * dx + dy * dy),
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
            this.conntect(sortedByDist[0].obj, cityObject)
            this.conntect(sortedByDist[1].obj, cityObject)

        } else if (cityObject instanceof Consumer) {
            const node = this.cityObjects.find(o => o instanceof Node)
            this.addCityObject(cityObject)
            this.conntect(node, cityObject)
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
    conntect(a, b) {
        let aIndex = this.cityObjects.indexOf(a);
        let bIndex = this.cityObjects.indexOf(b);
        this.conntections.push([aIndex, bIndex]);
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
        let cIndex = this.conntections.findIndex(c => c == [aIndex, bIndex] || c == [bIndex, aIndex])
        this.conntections.splice(cIndex, 1)
    }

    draw(ctx) {
        this.conntections.forEach(conntection => {
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            let a = this.cityObjects[conntection[0]];
            let b = this.cityObjects[conntection[1]];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
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
        let length = 0;
        this.conntections.forEach(conntection => {
            let a = this.cityObjects[conntection[0]];
            let b = this.cityObjects[conntection[1]];
            length += Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        });
        return length;
    }

    /**
     * Mutate a City. Currently moves around the nodes by chance.
     * @param {*} mutationRate the chance that a city can mutate
     * @param {*} maxMutation the maximal move delta of a node
     */
    mutateNodes(mutationRate, maxMutation) {
        return this.cityObjects.map(cityObject => {
            if(cityObject instanceof Node && Math.random() < mutationRate) {
                let direction = Math.floor(Math.random() * 2) - 1;
                if(direction == 0) direction = 1;
                cityObject.x += (Math.floor(Math.random() * maxMutation) + 1) * direction;

                direction = Math.floor(Math.random() * 2) - 1;
                if(direction == 0) direction = 1;
                cityObject.y += Math.floor(Math.random() * maxMutation) * direction;
            }
            return Object.assign(Object.create(Object.getPrototypeOf(cityObject)), cityObject);
        }); 
    }
}