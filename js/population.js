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

    nextPopulation() {
        let fittest = this.getFittest()
        let cities = new Array(this.config.size)

        cities[0] = fittest;
        for(var i = 1; i < this.config.size; i++) {
            let child = fittest.clone()
            child.mutate(this.config)
            cities[i] = child
        }
        this.cities = cities
    }

    repopulate(example) {
        this.cities = new Array(this.config.size).fill(example)
    }

    updateConfig(config) {
        this.config = config;
    }
}