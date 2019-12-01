import * as R from 'ramda';

import * as Util from '../util';

type Input = number[];

// const calculateFuel = R.pipe(R.flip(R.divide)(3), Math.floor, R.flip(R.subtract)(2));

const calculateFuel = (mass: number) => {
    return Math.floor(mass / 3) - 2;
};

// const calculateFuelChain = (mass: number): number => {
//     return R.cond<number, number>([
//         [R.gt(R.__, 0), fuel => fuel + calculateFuelChain(fuel)],
//         [R.T, R.always(0)],
//     ])(calculateFuel(mass));
// };

const calculateFuelChain = (mass: number): number => {
    const fuel = calculateFuel(mass);

    return fuel > 0 ? fuel + calculateFuelChain(fuel) : 0;
};

const accumulateFuel = (input: Input, method: (mass: number) => number) => {
    return R.pipe(R.map(method), R.sum)(input);
};

const part1 = (input: Input) => {
    return accumulateFuel(input, calculateFuel);
};

const part2 = (input: Input) => {
    return accumulateFuel(input, calculateFuelChain);
};

export const run = () => {
    const inputData = Util.loadInput('01').map(Number);

    console.log('Part 1', part1(inputData));
    console.log('Part 2', part2(inputData));
};
