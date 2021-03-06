
/**
 * Die "Population"-Klasse stellt eine Sammlung von mehreren
 * Städten dar, die den Evolutionsverlauf simuliert.
 * Nachdem eine Population Ausgangs-Städte erhalten hat,
 * mit denen die Evolution begonnen werden kann, werden immer
 * wieder diese Schritte wiederholt:
 * * Selektion
 * * Repopulation
 * * Mutation
 * Diese Schritte sind alle in der Methode "nextPopulation"
 * wiederzufinden. Jede ausgeführte Evolutionsrunde nennt man
 * auch eine "Epoche"
 */
class Population {
    /**
     * Kreiere eine neue Population mit einer Start-Stadt (initialCity)
     * und bestimmter Konfigurationen, z.B. wie groß die Kapazität der
     * Population ist.
     * @param {Object} config - Konfigurationsobjekt
     * @param {City} initialCity - Stadt, die zu beginn die Kapazitäten füllen wird
     */
    constructor(config, initialCity) {
        this.cities = new Array(config.size); 
        this.config = config;

        // füllen der Population, wir nutzen einfach repopulate
        this.repopulate(initialCity);
    }

    /**
     * Ermittelt das beste Individuum/Stadt der Population.
     * @return die Stadt mit der höchsten Fitness
     */
    getFittest() {
         // irgendeine Stadt für den Anfang
        let bestCity = this.cities[0];

        for(let i = 1; i < this.cities.length; i++) {
            let city = this.cities[i];
            if(city.getFitness(this.config) > bestCity.getFitness(this.config)) {
                bestCity = city;
            }
        }

        return bestCity;
    }

    /**
     * Simuliert eine Epoche in folgenden Einzelschritten:
     * * Selektion
     * * Repopulation
     * * Mutation
     */
    nextGeneration() {
        // Selektion
        let best = this.getFittest();

        // config.size ist vielleicht größer/kleiner als vorher
        let newCities = new Array(this.config.size);

        // Repopulation
        newCities[0] = best;
        for (let i = 1; i < newCities.length; i++) {
            let newCity = best.clone();

            // Mutation
            newCity.mutate(this.config);

            newCities[i] = newCity;
        }

        this.cities = newCities;
    }

    /**
     * Falls Konfigurationen geändert wurden, kann man so dieser
     * Population die Änderungen mitteilen.
     * @param {Object} config - Konfigurationsobjekt, das evtl. verändert wurde
     */
    updateConfig(config) {
        this.config = config;
    }

    /**
     * Setze die Population zurück - das bedeutet, alle Kapazitäten
     * der Population werden mit ein und der selben Stadt gefüllt.
     * @param {City} initialCity - Stadt, die die Kapazitäten füllen wird
     */
    repopulate(initialCity) {
        this.cities = new Array(this.config.size);
        for(let i = 0; i < this.cities.length; i++) {
            this.cities[i] = initialCity;
        }
    }
}