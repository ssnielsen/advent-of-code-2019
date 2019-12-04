import * as R from 'ramda';

const isRepeating = ([c1, c2]: [string, string]) => {
    return c1 === c2;
};

const isNotDecreasing = ([c1, c2]: [string, string]) => {
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
    )();
};

const part2 = (from: number, to: number) => {
    return R.pipe(
        // Merge "apertured" array back together
        R.map((x: string[][]) => [...x.map(R.head), x[x.length - 1][1]]),
        R.filter(candidate => {
            return R.any((i: number) => {
                return (
                    candidate[i] === candidate[i + 1] &&
                    (candidate[i - 1] === undefined ||
                        candidate[i - 1] !== candidate[i]) &&
                    (candidate[i + 2] === undefined ||
                        candidate[i + 1] !== candidate[i + 2])
                );
            })(R.range(0, candidate.length));
        }),
    )(part1(from, to));
};

export const run = () => {
    const from = 128392;
    const to = 643281;

    console.log('Part 1:', part1(from, to).length);
    console.log('Part 2:', part2(from, to).length);
};
