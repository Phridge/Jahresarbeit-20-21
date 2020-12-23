class City {
    constructor() {
        this.cityObjects = []
        this.connections = []
    }

    /**
     * Add a city object with its corresponding connection
     * @param {*} cityObject the object to be added
     * @param {*} connection its connection; can be null
     */
    addCityObject(cityObject, connection) {
        const index = this.cityObjects.length
        this.cityObjects.push(cityObject)
        this.connections.push(connection)
        delete this.fitness
        return index
    }

    /**
     * Get the index of an city object. -1 if not found.
     * @param {*} obj the city object
     */
    getIndex(obj) {
        return this.cityObjects.indexOf(obj)
    }

    /**
     * Set the connection for a city object. No validity checks.
     * @param {*} objIndex the object that gets reconnected
     * @param {*} connection its new connection
     */
    setConnection(objIndex, connection) {
        this.connections[objIndex] = connection
        delete this.fitness
    }

    /**
     * Get the indices of city objects directly connected to some object.
     * @param {*} objIndex city objet index to which others may be connected
     * @returns a Set of indices
     */
    cityObjectsConnectedTo(objIndex) {
        let result = new Set()
        this.connections.forEach((to, from) => {
            if(to == objIndex) {
                result.add(from)
            }
        })
        return result
    }

    /**
     * Get the indices of city objects that are directly or indirectly connected to some object.
     * @param {*} objIndex the index of the object that gets checked
     * @returns a Set of indices that somewhat are connected to objIndex
     */
    cityObjectsIndirectlyConnectedTo(objIndex) {
        let result = new Set([objIndex]) // add the target so searching is easier
        this.connections.forEach((to, from) => {
            if(result.has(to)) {
                result.add(from)
            }
        })
        result.delete(objIndex) // the target doesn't count
        return result
    }

    indirectConnectionBetween(from, to) {
        if(from === to) {
            return true
        }

        do {
            from = this.connections[from]
            if(from == to) {
                return true
            }
        } while(from !== null)
        return false
    }

    /**
     * Remove a City object and its connection.
     * Connections that pointed towards this object now point to its connection target.
     * @param {*} index index of removed city object
     */
    removeCityObject(index) {
        let reconnectTarget = this.connections[index] >= index ? this.connections[index] - 1 : this.connections[index]

        this.cityObjects.splice(index, 1)
        this.connections.splice(index, 1)
        
        // revalidate all the connections that point TO or ABOVE the city object
        for(var i = 0, stop = this.connections.length; i < stop; i++) {
            if(this.connections[i] === index) {
                this.connections[i] = reconnectTarget
            } else if (this.connections[i] > index) {
                this.connections[i] -= 1
            }
        }

        delete this.fitness
    }

    /**
     * Returns the city object that contains the specified coordinates.
     * @param {*} position the point on the screen
     * @param {*} drawConfig config used for drawing that influences behaviour of city objects
     */
    getCityObjectNear(position, drawConfig) {
        return this.cityObjects.find(obj => obj.containsPosition(position, drawConfig))
    }

    /**
     * Draw the scene to a WebGL context
     * @param {*} ctx the context
     * @param {*} drawConfig config that some city objects require for functioning
     */
    draw(ctx, drawConfig) {
        ctx.lineWidth = drawConfig.connection.width
        this.connections.forEach((to, from) => { if(to !== null) {
            ctx.beginPath();
            ctx.strokeStyle = drawConfig.connection.color;
            let a = this.cityObjects[from];
            let b = this.cityObjects[to];
            ctx.moveTo(a.pos.x, a.pos.y);
            ctx.lineTo(b.pos.x, b.pos.y);
            ctx.stroke();
        }});
        this.cityObjects.forEach(cityObject => {
            cityObject.draw(ctx, drawConfig);
        });
    }

    /**
     * The fitness is calculated by adding the lengths of all connections, adding
     * some extra length for each Node
     * and "flipping" the number so "shorter" cities have a higher score.
     * @param {*} config configuration data is required for correct calculation.
     * @return The fitness score. Higher means better.
     */
    getFitness(config) {
        if(!this.fitness) {
            var length = 0
            this.connections.forEach((to, from) => { if(to !== null) {
                from = this.cityObjects[from]
                to = this.cityObjects[to]

                length += from.pos.dist(to.pos)
                
                if(from instanceof Node) {
                    length += config.nodePenalty
                }
            }})
            // this calculation ensures that the shortest length sum
            // gets the most points
            this.fitness = 100 / (length / 100 + 1)
        }
        return this.fitness
    }

    /**
     * Calculate the total length of only the connections of this city
     */
    getLength() {
        return this.connections.reduce((acc, to, from) => { if(to !== null) {
            from = this.cityObjects[from];
            to = this.cityObjects[to];
            return acc + from.pos.dist(to.pos);
        } else {
            return acc
        }}, 0)
    }

    /**
     * Mutate a City.
     * Currently includes:
     * * Node moving
     * @param {*} config chances and values to control the mutation process
     */
    mutate(config) {
        // create nodes
        for (var from = 0, stop = this.connections.length; from < stop; from++) {
            let to = this.connections[from]
            if (to !== null && Math.random() < config.nodeMutationChance) {
                let a = this.cityObjects[from]
                let b = this.cityObjects[to]
                let spawnDist = a.pos.dist(b.pos)
                let randomOffset = new Position(
                    Math.random() * spawnDist,
                    Math.random() * spawnDist,
                )
                let newNodeIndex = this.addCityObject(new Node(b.pos.add(randomOffset)), to)
                this.connections[from] = newNodeIndex
            }
        }

        // move
        this.cityObjects.forEach(cityObject => {
            if(cityObject instanceof Node && Math.random() < config.moveChance) {
                cityObject.moveRandomly(config.maxMoveDelta)
            }
        })

        // reconnect
        for(var from = 0, stop = this.connections.length; from < stop; from++) {
            if (this.connections[from] !== null && Math.random() < config.reconnectChance) {
                let whitelist = []
                for(var i = 0; i < this.cityObjects.length; i++) {
                    if(!this.indirectConnectionBetween(i, from)) {
                        whitelist.push(i)
                    }
                }

                let reconnectTo = whitelist[Math.floor(Math.random() * whitelist.length)]
                this.connections[from] = reconnectTo
            }
        }

        // delete nodes
        for(var i = 0; i < this.connections.length; i++) {
            if (this.cityObjects[i] instanceof Node && Math.random() < config.nodeMutationChance) {
                this.removeCityObject(i)
                i--
            }
        }

        delete this.fitness
    }

    /**
     * Make an exact copy of this city.
     */
    clone() {
        let c = Object.create(City.prototype)
        c.cityObjects = Array.from(this.cityObjects, o => o.clone())
        c.connections = Array.from(this.connections)
        return c
    }
}