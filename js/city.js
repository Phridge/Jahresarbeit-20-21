class City {
    constructor(cityObjects) {
        this.cityObjects = cityObjects;
        this.conntections = [];
    }

    addCityObject(cityObject) {
        this.cityObjects.push(cityObject);
    }

    conntect(a, b) {
        let aIndex = this.cityObjects.indexOf(a);
        let bIndex = this.cityObjects.indexOf(b);
        this.conntections.push([aIndex, bIndex]);
    }

    draw(ctx) {
        this.conntections.forEach(conntection => {
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            let a = this.cityObjects[conntection[0]];
            let b = this.cityObjects[conntection[1]];
            ctx.moveTo(a.x + a.width/2, a.y + a.height/2);
            ctx.lineTo(b.x + b.width/2, b.y + b.height/2);
            ctx.stroke();
        });
        this.cityObjects.forEach(cityObject => {
            cityObject.draw(ctx);
        });
    }

    setConnections(conntections) {
        this.conntections = conntections;
    }

    getConntections() {
        return this.conntections;
    }

    getFitness() {
        let length = 0;
        this.conntections.forEach(conntection => {
            let a = this.cityObjects[conntection[0]];
            let b = this.cityObjects[conntection[1]];
            length += Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        });
        return length;
    }

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