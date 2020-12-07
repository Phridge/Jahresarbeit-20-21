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
            .filter(con => con[0] != index && con[1] != index) // filter out the connections to the index
            .map(con => { // redirect connections to the correct index
                con[0] -= con[0] > index ? 1 : 0
                con[1] -= con[1] > index ? 1 : 0
                return con
        })
        this.cityObjects.splice(index, 1)
        delete this.fitness
    }

    /**
     * Returns the city object that contains the specified coordinates.
     * @param {*} position the point on the screen
     */
    getCityObjectNear(position) {
        return this.cityObjects.find(obj => obj.containsPosition(position))
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
     * @param {*} config configuration data is required for correct calculation.
     * @return The fitness score. Higher means better.
     */
    getFitness(config) {
        if(!this.fitness) {
            this.fitness = this.connections.reduce((acc, connection) => {
                const a = this.cityObjects[connection[0]]
                const b = this.cityObjects[connection[1]]
                return acc + a.pos.dist(b.pos)
            }, 0)
            this.fitness += this.cityObjects.filter(o => o instanceof Node).length * config.nodePenalty
            // this calculation ensures that the shortest distance sum
            // gets the most points
            this.fitness = 100 / (this.fitness / 100 + 1)
        }
        return this.fitness
    }

    getLength() {
        const length = this.connections.reduce((acc, connection) => {
            const a = this.cityObjects[connection[0]];
            const b = this.cityObjects[connection[1]];
            return acc + a.pos.dist(b.pos);
        }, 0);
        return length;
    }

    /**
     * Mutate a City.
     * @param {*} config chances and values to control the mutation process
     */
    mutate(config) {
        // merge
        if(Math.random() < config.connectionMutateChance) {
            let nodes = this.cityObjects.filter(cityObject => cityObject instanceof Node)

            let node = nodes[Math.floor(Math.random() * nodes.length)]
            let nodeIndex = this.getIndex(node)
            let connections = this.connectionsTo(nodeIndex)

            if(connections.length == 2) {
                let cityObjIndexA = connections[0][0] == nodeIndex ? connections[0][1] : connections[0][0]
                let cityObjIndexB = connections[1][0] == nodeIndex ? connections[1][1] : connections[1][0]
                
                this.connect(cityObjIndexA, cityObjIndexB)
                this.removeCityObject(nodeIndex)
            }
        }
        // split
        this.connections.forEach(connection => {
            if (Math.random() < config.connectionMutateChance) {
                // make a new node thats between the two endpoints
                let node = new Node(
                    this.cityObjects[connection[0]].pos.add(this.cityObjects[connection[1]].pos).mul(1 / 2)
                )
                let nodeIndex = this.addCityObject(node)

                // modify the first connection
                let oldEndpoint = connection[0]
                connection[0] = nodeIndex
                // and add a new one
                this.connect(oldEndpoint, nodeIndex)
            }
        })
        // move
        this.cityObjects.forEach(cityObject => {
            if(cityObject instanceof Node && Math.random() < config.moveChance) {
                cityObject.moveRandomly(config.maxMoveDelta)
            }
        });
        // reconnect
        this.connections.filter(connection => {
            let a = this.cityObjects[connection[0]]
            let b = this.cityObjects[connection[1]]
            return ((a instanceof Node && b instanceof Consumer) ||
                (a instanceof Consumer && b instanceof Node)) &&
                Math.random() < config.reconnectChance
        }).forEach(connection => {
            let reconnectEndpoint = this.cityObjects[connection[0]] instanceof Node ? 0 : 1
            // we filter out all nodes available
            let nodes = this.cityObjects.filter(o => o instanceof Node)
            // reconnect to some random node, could be the current one too
            connection[reconnectEndpoint] = this.getIndex(nodes[Math.floor(Math.random() * nodes.length)])
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