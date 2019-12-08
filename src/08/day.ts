import * as R from 'ramda';

import * as Util from '../util';

type Layers = number[][][];
type Counts = {[index: string]: number};

const X = (counts: Counts) => R.min(counts[0]);

const part1 = (layers: Layers) => {
    const res = R.pipe(
        R.map((layer: Layers[0]) => R.flatten(layer)),
        R.map(R.countBy(Math.floor)),
        R.reduce(
            (leastZeros, layerCount: Counts) =>
                layerCount[0] < leastZeros[0] ? layerCount : leastZeros,
            {0: Infinity, 1: 0, 2: 0} as Counts,
        ),
    )(layers);

    return res[1] * res[2];
};

const WIDTH = 25;
const HEIGHT = 6;

export const run = () => {
    const input = Util.loadInput('08')[0];

    const layers = R.pipe(
        R.split(''),
        R.map(x => Number(x)),
        R.splitEvery(WIDTH * HEIGHT),
        R.map(R.splitEvery(6)),
    )(input) as Layers;

    console.log('Part 1:', part1(layers));
};
