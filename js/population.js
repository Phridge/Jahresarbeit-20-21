class Population {
    constructor(size, mutationRate, maxMutation, example) {
        this.size = size;
        this.mutationRate = mutationRate;
        this.maxMutation = maxMutation;
        this.cities = [];
        for(let i = 0; i < this.size; i++) {
            let next = Object.assign(Object.create(Object.getPrototypeOf(example)), example);
            next.cityObjects = next.mutateNodes(mutationRate, maxMutation);
            this.cities.push(next);
        }
    }

    getFittest() {
        let previousBest = this.cities[0];
        this.cities.forEach(city => {
            if(previousBest.getFitness() > city.getFitness()) {
                previousBest = city;
            }
        });
        return previousBest;
    }

    nextPopulation() {
        return new Population(this.size, this.mutationRate, this.maxMutation, this.getFittest());
    }
}