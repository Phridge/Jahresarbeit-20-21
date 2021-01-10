class City {
    constructor() {
        this.cityObjects = [];
    }

    addTransformer(pos, connection = 0) {
        return this.addCityObject(new Transformer(pos, connection));
    }

    addConsumer(pos, connection = 0) {
        return this.addCityObject(new Consumer(pos, connection));
    }
    
    addNode(pos, connection = 0) {
        return this.addCityObject(new Node(pos, connection));
    }

    addCityObject(obj) {
        let index = this.cityObjects.length;
        this.cityObjects.push(obj);
        delete this.fitness;
        return index;
    }

    cityObjectAt(index) {
        return this.cityObjects[index].clone();
    }

    indexOf(obj) {
        return this.cityObjects.indexOf(obj);
    }

    /**
     * Set the connection for a city object. No validity checks.
     * @param {*} objIndex the object that gets reconnected
     * @param {*} connection its new connection
     */
    setConnection(objIndex, connection) {
        this.cityObjects[objIndex].connection = connection;
        delete this.fitness;
    }

    /**
     * Get the indices of city objects directly connected to some object.
     * @param {*} objIndex city objet index to which others may be connected
     * @returns a Set of indices
     */
    cityObjectsConnectedTo(objIndex) {
        let result = new Set();
        for(let i = 0; i < this.cityObjects.length; i++) {
            if(this.cityObjects[i].connection == objIndex) {
                result.add(i);
            }
        }
        return result;
    }

    cityObjectsUnrelatedTo(objIndex) {
        let result = new Set();
        for(let i = 0; i < this.cityObjects.length; i++) {
            if(!this.indirectConnectionBetween(i, objIndex)) {
                result.add(i);
            }
        }
        return result;
    }

    indirectConnectionBetween(from, to) {
        while(from !== to) {
            if(from === null) {
                return false;
            } else {
                from = this.cityObjects[from].connection;
            }
        }
        return true;
    }

    /**
     * Remove a City object and its connection.
     * Connections that pointed towards this object now point to its connection target.
     * @param {*} index index of removed city object
     */
    removeCityObject(index) {
        let target = this.cityObjects[index];
        let reconnectTarget = target.connection - (target.connection >= index ? 1 : 0);

        this.cityObjects.splice(index, 1);
        
        // revalidate all the connections that point TO or ABOVE the city object
        for(var i = 0, stop = this.cityObjects.length; i < stop; i++) {
            let obj = this.cityObjects[i];
            if(obj.connection === index) {
                obj.connection = reconnectTarget;
            } else if (obj.connection > index) {
                obj.connection -= 1;
            }
        }

        delete this.fitness;
    }

    /**
     * Returns the city object that contains the specified coordinates.
     * @param {*} position the point on the screen
     * @param {*} drawConfig config used for drawing that influences behaviour of city objects
     */
    getCityObjectNear(position, drawConfig) {
        return this.cityObjects.find(obj => obj.containsPosition(position, drawConfig));
    }

    /**
     * Draw the scene to a WebGL context
     * @param {*} ctx the context
     * @param {*} drawConfig config that some city objects require for functioning
     */
    draw(ctx, drawConfig) {
        ctx.lineWidth = drawConfig.connection.width;
        ctx.strokeStyle = drawConfig.connection.color;
        for(let i = 0; i < this.cityObjects.length; i++) {
            ctx.beginPath();
            let from = this.cityObjects[i];
            let to = this.cityObjects[from.connection];
            if(!to) continue;

            ctx.moveTo(from.pos.x, from.pos.y);
            ctx.lineTo(to.pos.x, to.pos.y);
            ctx.stroke();
        }
        for (let i = 0; i < this.cityObjects.length; i++) {
            this.cityObjects[i].draw(ctx, drawConfig);
        }
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
            var length = 0;
            for(let i = 0; i < this.cityObjects.length; i++) {
                let from = this.cityObjects[i];
                let to = this.cityObjects[from.connection];
                if(!to) continue;

                length += from.pos.dist(to.pos);

                if (from instanceof Node) {
                    length += config.nodePenalty;
                }
            }
            
            // this calculation ensures that the shortest length sum
            // gets the most points
            this.fitness = 100 / (length / 100 + 1);
        }
        return this.fitness;
    }

    /**
     * Calculate the total length of only the connections of this city
     */
    getLength() {
        let acc = 0;
        for(let i = 0; i < this.cityObjects.length; i++) {
            let from = this.cityObjects[i];
            let to = this.cityObjects[from.connection];
            if(!to) continue;

            acc += from.pos.dist(to.pos);
        }
        return acc;
    }

    /**
     * Mutate a City.
     * Currently includes:
     * * Node moving
     * @param {*} config chances and values to control the mutation process
     */
    mutate(config) {

        // delete nodes
        for (var i = 0; i < this.cityObjects.length; i++) {
            if (this.cityObjects[i] instanceof Node && Math.random() < config.nodeMutationChance) {
                this.removeCityObject(i);
                i--;
            }
        }
        
        // create nodes
        for (var i = 0, stop = this.cityObjects.length; i < stop; i++) {
            let from = this.cityObjects[i];
            let to = this.cityObjects[from.connection];
            if (to && Math.random() < config.nodeMutationChance) {
                let dest = from.pos.add(to.pos).mul(1/2);
                let newNodeIndex = this.addNode(dest, from.connection);
                this.setConnection(i, newNodeIndex);
            }
        }

        // move
        this.cityObjects.forEach(cityObject => {
            if(cityObject instanceof Node && Math.random() < config.moveChance) {
                cityObject.moveRandomly(config.maxMoveDelta);
            }
        });

        // reconnect
        for(let i = 0, stop = this.cityObjects.length; i < stop; i++) {
            let from = this.cityObjects[i];
            let to = this.cityObjects[from.connection];
            if (to && Math.random() < config.reconnectChance) {
                let unrelatedSet = Array.from(this.cityObjectsUnrelatedTo(i).keys());
                let reconnectTo = unrelatedSet[Math.floor(Math.random() * unrelatedSet.length)];
                from.connection = reconnectTo;
            }
        }

        delete this.fitness;
    }

    /**
     * Make an exact copy of this city.
     */
    clone() {
        let clone = Object.create(City.prototype);
        clone.cityObjects = Array.from(this.cityObjects, o => o.clone());
        return clone;
    }
}