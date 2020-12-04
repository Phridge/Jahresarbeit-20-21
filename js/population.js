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
        this.maxMutation = maxMoveDelta;
        this.cities = [example]; // keep the best city 
        for(let i = 1; i < this.size; i++) {
            // let next = Object.assign(Object.create(Object.getPrototypeOf(example)), example);
            let next = example.clone()
            next.mutateNodes(mutationRate, maxMoveDelta);
            this.cities.push(next);
        }
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
        return new Population(this.size, this.mutationRate, this.maxMutation, this.getFittest());
    }
}