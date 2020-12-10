class City {
    constructor(cityObjects) {
        this.cityObjects = cityObjects;
        this.connections = [];
    }

    addCityObject(cityObject) {
        const index = this.cityObjects.length;
        this.cityObjects.push(cityObject);
        return index;
    }

    removeCityObject(index) {
        this.connections = this.connections
            .filter(con => con[0] != index && con[1] != index)
            .map(con => {
                con[0] -= con[0] > index ? 1 : 0;
                con[1] -= con[1] > index ? 1 : 0;
                return con;
            });
        this.cityObjects.splice(index, 1);
    }

    connect(a, b) {
        this.connections.push([a, b]);
    }

    disconnect(a, b) {
        let c = this.connections.findIndex(c => c == [a, b] || c == [b, a]);
        this.connections.splice(c, 1);
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
}