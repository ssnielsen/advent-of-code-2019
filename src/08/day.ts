import * as R from 'ramda';

import * as Util from '../util';

type Layers = number[][][];
type Counts = {[index: string]: number};

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

const part2 = (layers: Layers) => {
    const flattened = R.range(0, HEIGHT).map(x => {
        return R.range(0, WIDTH).map(y => {
            return R.range(0, layers.length)
                .reverse()
                .reduce((value, layer) => {
                    const layersValue = layers[layer][x][y];
                    return layersValue === 2 ? value : layersValue;
                }, 2);
        });
    });

    return flattened;
};

const printImage = (image: Layers[0]) => {
    image.forEach(x => {
        console.log(x.map(pixel => (pixel === 0 ? '█' : ' ')).join(''));
    });
};

const HEIGHT = 6;
const WIDTH = 25;

export const run = () => {
    const input = Util.loadInput('08')[0];

    const layers = R.pipe(
        R.split(''),
        R.map(x => Number(x)),
        R.splitEvery(WIDTH * HEIGHT),
        R.map(R.splitEvery(WIDTH)),
    )(input) as Layers;

    console.log('Part 1:', part1(layers));
    console.log('Part 2:');
    printImage(part2(layers));
};
