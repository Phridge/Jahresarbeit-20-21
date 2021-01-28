
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
     * Kreiere eine neue Population mit einer Start-Stadt und gewisser Kapazität.
     * @param {City} initialCity - Die Stadt, die mehrmals kopiert wird
     * um die Kapazitäten zu füllen
     * @param {Number} size - wie viele Städte es je Epoche gibt
     */
    constructor(initialCity, size) {
        this.cities = new Array(size); 

        // füllen der Population
        this.cities[0] = initialCity;
        for(let i = 1; i < size; i++) {
            this.cities[i] = initialCity.clone();
        }
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
            if(city.getFitness() > bestCity.getFitness()) {
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

        // Repopulation
        this.cities[0] = best;
        for (let i = 1; i < this.cities.length; i++) {
            let newCity = best.clone();
            
            // Mutation
            newCity.mutate();

            this.cities[i] = newCity;
        }
    }
}