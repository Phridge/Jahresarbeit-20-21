class Auto {
    constructor(typ, hersteller, jahrgang, farbe, halter) {
        this.typ = typ;
        this.hersteller = hersteller;
        this.jahrgang = jahrgang;
        this.farbe = farbe;
        this.halter = halter;
    }

    hupen() {
        console.log("Das Auto von " + this.halter + " hupt");
    }

    informationen() {
        console.log("Infos: " + this.typ + ", " + this.hersteller + ", " + this.jahrgang + ", " + this.farbe);
    }
}
let meinAuto = new Auto("Combi", "VW", "2008", "Rot", "Max Mustermann");
console.log(meinAuto.farbe);
meinAuto.hupen();
meinAuto.informationen();

let deinAuto = {
    typ: "Combi",
    hersteller: "VW",
    jahrgang: "2008",
    hupen: () => {
        console.log("Das Auto hupt");
    }
}
console.log(deinAuto.hersteller);
deinAuto.hupen();