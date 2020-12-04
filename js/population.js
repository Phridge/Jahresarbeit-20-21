class Population {

    /**
     * Create a new Population with mutation characteristics
     * and a "prefab" city, which gets copied size-1 times.
     * The examble city is part of this population, so the node
     * position stabilizes on the best position over time.
     * @param {*} size population size
     * @param {*} mutationRate the chance of mutations
     * @param {*} maxMoveDelta the maximal distance a node can move
     * @param {*} example the city that gets copied and mutated
     */
    constructor(size, mutationRate, maxMoveDelta, example) {
        this.size = size;
        this.mutationRate = mutationRate;
        this.maxMoveDelta = maxMoveDelta;
        this.repopulate(example)
    }

    getFittest() {
        let currentBest = this.cities[0]; // choose one randomly
        this.cities.forEach(city => {
            if(currentBest.getFitness() > city.getFitness()) {
                currentBest = city;
            }
        });
        return currentBest;
    }

    nextPopulation() {
        const fittest = this.getFittest()
        const cities = new Array(this.size)

        cities[0] = fittest;
        for(var i = 1; i < this.size; i++) {
            const child = fittest.clone()
            child.mutate(this.mutationRate, this.maxMoveDelta)
            cities[i] = child
        }
        this.cities = cities
    }

    repopulate(example) {
        this.cities = new Array(this.size).fill(example)
    }
}