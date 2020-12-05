class City {
    constructor(cityObjects) {
        this.cityObjects = cityObjects;
        this.connections = [];
    }

    addCityObject(cityObject) {
        const index = this.cityObjects.length
        this.cityObjects.push(cityObject)
        delete this.fitness
        return index
    }

    /**
     * Adds a city object.
     * If it is a Node, it seeks the nearest two city objects and places itself in
     * between the objects. If it is a Consumer, it connects to the nearest
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
            const cityObjectIndex = this.addCityObject(cityObject)
            if(node) {
                // if the node was found, add the connection
                this.connect(this.getIndex(node), cityObjectIndex)
            }
        } else {
            throw Error("Not a city object")
        }
        delete this.fitness
    }

    /**
     * Get the index of an city object. -1 if not found.
     * @param {*} obj the city object
     */
    getIndex(obj) {
        return this.cityObjects.indexOf(obj)
    }

    /**
     * Adds a connection between two nodes.
     * @param {*} a first node index
     * @param {*} b second node index
     */
    connect(a, b) {
        this.connections.push([a, b]);
        delete this.fitness
    }

    /**
     * Clear any connection between two objects (indices).
     * Does nothing if no connections exists.
     * @param {*} a one part of the connection
     * @param {*} b the other part of the connection
     */
    disconnect(a, b) {
        let c = this.connections.findIndex(c => c == [a, b] || c == [b, a])
        this.connections.splice(c, 1)
        delete this.fitness
    }

    /**
     * Get the connections to a city object at specified index.
     * @param {*} index index of the city object
     */
    connectionsTo(index) {
        return this.connections.filter(c => c[0] == index || c[1] == index)
    }

    /**
     * Remove a City object and all its connectinons.
     * @param {*} index index of removed city object
     */
    removeCityObject(index) {
        this.connections = this.connections
            .filter(c => c[0] != index && c[1] != index) // filter out the connections to the index
            .map(con => { // redirect connections to the correct index
                con[0] -= con[0] > index ? 0 : 1
                con[1] -= con[1] > index ? 0 : 1
        })
        this.cityObjects.splice(index, 1)
        delete this.fitness
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
     * The fitness is calculated by adding the lengths of all connections
     * and "flipping" the number so fitter citys have a higher score.
     * @return The fitness score. Higher means better.
     */
    getFitness() {
        if(!this.fitness) {
            this.fitness = this.connections.reduce((acc, connection) => {
                const a = this.cityObjects[connection[0]]
                const b = this.cityObjects[connection[1]]
                return acc + a.pos.dist(b.pos)
            }, 0)
            // this calculation ensures that the shortest distance sum
            // gets the most points
            this.fitness = 100 / (this.fitness / 100 + 1)
        }
        return this.fitness
    }

    /**
     * Mutate a City. Currently only moves around the nodes by chance.
     * @param {*} mutationRate the chance that a city can mutate
     * @param {*} maxDist the maximal move delta of a node in x or y direction
     */
    mutate(mutationRate, maxDist) {
        this.cityObjects.forEach(cityObject => {
            if(cityObject instanceof Node && Math.random() < mutationRate) {
                cityObject.moveRandomly(maxDist)
            }
        });
        this.connections.forEach(connection => {
            if(Math.random() < 0.05) { // TODO: make chance variable
                // each connection connects a Node to a Consumer or a Node
                let objA = this.cityObjects[connection[0]]
                let objB = this.cityObjects[connection[1]]
                let reconnectEndpoint = objA instanceof Node ? 0 : 1
                let referencedNodes = [
                    objA instanceof Node && objA,
                    objB instanceof Node && objB,
                ].filter(o => o)

                // we filter out a Node we don't connect to
                let nodes = this.cityObjects.filter(o => o instanceof Node && !referencedNodes.includes(o))
                
                // if there is at least one node, reconnect to a random one
                if(nodes.length >= 1) {
                    connection[reconnectEndpoint] = this.getIndex(nodes[Math.floor(Math.random() * nodes.length)])
                } else {
                    // do nothing if there is only one Node
                }
            }
        })
        delete this.fitness
    }

    /**
     * Make an exact copy of this city.
     */
    clone() {
        const c = new City(Array.from(this.cityObjects, o => o.clone()))
        c.connections = Array.from(this.connections, con => Array.from(con))
        return c
    }
}