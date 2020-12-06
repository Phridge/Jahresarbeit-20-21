class Population {

    /**
     * Create a new Population with mutation characteristics
     * and a "prefab" city, which gets copied size-1 times.
     * The examble city is part of this population, so the node
     * position stabilizes on the best position over time.
     * @param {*} config configurations that can be controlled by the user
     * @param {*} example the city that gets copied and mutated
     */
    constructor(config, example) {
        this.config = config;
        this.repopulate(example)
    }

    getFittest() {
        let currentBest = this.cities[0]; // choose one randomly
        this.cities.forEach(city => {
            if(city.getFitness(this.config) > currentBest.getFitness(this.config)) {
                currentBest = city;
            }
        });
        return currentBest;
    }

    /*nextPopulation() {
        let fittest = this.getFittest()
        let cities = new Array(this.config.size)

        cities[0] = fittest;
        for(var i = 1; i < this.config.size; i++) {
            let child = fittest.clone()
            child.mutate(this.config)
            cities[i] = child
        }
        this.cities = cities
    }*/

    nextPopulation() {
        this.cities.sort((a, b) => b.getFitness(this.config) - a.getFitness(this.config))
        let newCities = new Array(this.config.size)

        for(var lo = 0, hi = this.config.size -1; hi > lo; hi--, lo++) {
            let parent = this.cities[lo]
            let child = parent.clone()

            child.mutate(this.config)

            newCities[lo] = parent
            newCities[hi] = child

            if(lo >= this.cities.length -1) {
                // points to the last city
                lo--
            }
        }

        // console.log(newCities.map(c => c.getFitness(this.config)));
        this.cities = newCities
    }

    repopulate(example) {
        this.cities = new Array(this.config.size).fill(example)
    }

    updateConfig(config) {
        this.config = config;
    }
}