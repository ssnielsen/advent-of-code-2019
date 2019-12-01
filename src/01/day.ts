import * as R from 'ramda';

import * as Util from '../util';

const inputData = Util.loadInput('01').map(Number);

const calculateFuel = (mass: number) => {
    return Math.floor(mass / 3) - 2;
};

const part1 = (input: typeof inputData) => {
    return R.pipe(R.map(calculateFuel), R.sum)(inputData);
};

const calculateFuelChain = (mass: number) => {
    let fuel = calculateFuel(mass);
    let totalFuel = 0;

    while (fuel > 0) {
        totalFuel += fuel;
        fuel = calculateFuel(fuel);
    }

    return totalFuel;
};

const part2 = (input: typeof inputData) => {
    return R.pipe(R.map(calculateFuelChain), R.sum)(inputData);
};

export const run = () => {
    console.log('Part 1', part1(inputData));
    console.log('Part 1', part2(inputData));
};
