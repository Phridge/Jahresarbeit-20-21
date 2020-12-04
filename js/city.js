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
}