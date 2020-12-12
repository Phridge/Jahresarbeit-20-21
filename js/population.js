class Population {

    /**
     * Create a new Population with mutation characteristics
     * and a "prefab" city, which gets copied size-1 times.
     * The example city is part of this population, so the node
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
        console.log(this.cities[0].getFitness(), this.cities[this.cities.length-1].getFitness());
        let size = this.config.size
        let newCities = new Array(size); // newCities[0] = this.cities[0];

        for(var i = 0; i < size; i++) {
            var x = Math.random()
            x = Math.pow(x, Math.exp(this.config.selectionBias))
            x = Math.floor(x * this.cities.length)

            let child = this.cities[x].clone()
            child.mutate(this.config)
            newCities[i] = child
        }

        this.cities = newCities
    }

    repopulate(example) {
        this.cities = (this.cities || new Array(this.config.size).fill(null)).fill(example)
    }

    updateConfig(config) {
        this.config = config;
    }
}