import * as R from 'ramda';

const isRepeating = ([c1, c2]: string[]) => {
    return c1 === c2;
};

const isNotDecreasing = ([c1, c2]: string[]) => {
    return c1 <= c2;
};

const test = (candidate: string[][]) => {
    return R.allPass([R.all(isNotDecreasing), R.any(isRepeating)])(candidate);
};

const part1 = (from: number, to: number) => {
    return R.pipe(
        () => R.range(from, to + 1),
        R.map(R.pipe(String, R.split(''), R.aperture(2))),
        R.filter(test),
    )().length;
};

export const run = () => {
    const from = 128392;
    const to = 643281;

    console.log('Part 1:', part1(from, to));
};
