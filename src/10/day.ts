import * as R from 'ramda';

import * as Util from '../util';

type Grid = boolean[][];
type Point = {x: number; y: number};

const coordinatesInSight = (from: Point, to: Point) => {
    if (from.x === to.x) {
        const x = from.x;
        const validPoints = R.range(
            R.min(from.y, to.y),
            R.max(from.y, to.y) + 1,
        )
            .map(y => {
                return {x, y, distance: manhattanDistance(from, {x, y})};
            })
            .filter(p => !(p.x === from.x && p.y === from.y));

        return R.sortBy(p => p.distance)(validPoints);
    }

    const gradient = (to.y - from.y) / (to.x - from.x);

    const validPoints = R.range(R.min(to.x, from.x), R.max(to.x, from.x) + 1)
        .map(x => {
            const y = (x - from.x) * (gradient || 0) + from.y;
            return {x, y, distance: manhattanDistance(from, {x, y})};
        })
        .filter(
            p => Number.isInteger(p.y) && !(p.x === from.x && p.y === from.y),
        );

    return R.sortBy(p => p.distance)(validPoints);
};

const manhattanDistance = (p1: Point, p2: Point) => {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

const distance = (p1: Point, p2: Point) => {
    return Math.sqrt(
        Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2),
    );
};

const part1 = (grid: Grid) => {
    const asteroids = R.xprod(
        R.range(0, grid.length),
        R.range(0, grid[0].length),
    )
        .filter(([x, y]) => grid[y][x])
        .map(([x, y]) => ({x, y}));

    // const edges = [
    //     ...R.range(0, grid.length).map(x => ({x, y: 0})),
    //     ...R.range(0, grid.length).map(y => ({x: 0, y})),
    //     ...R.range(0, grid.length).map(x => ({x, y: grid.length - 1})),
    //     ...R.range(0, grid.length).map(y => ({x: grid.length - 1, y})),
    // ];

    // const result = asteroids.reduce((maxVisible, [x, y]) => {
    //     const counted = new Array<Point>();

    //     const visibleForPoint = edges
    //         .filter(edgePoint => {
    //             if (x === 0 && y === 0) {

    //             }
    //         })
    //         .map(edgePoint => {
    //             const validPoints = coordinatesInSight({x, y}, edgePoint);
    //             // if (x === 3 && y === 4) {
    //             //     console.log(edgePoint, validPoints);
    //             // }
    //             const found = validPoints.find(
    //                 point =>
    //                     grid[point.y][point.x] &&
    //                     !counted.some(
    //                         countedPoint =>
    //                             countedPoint.x === point.x &&
    //                             countedPoint.y === point.y,
    //                     ),
    //             );

    //             if (found) {
    //                 counted.push(found);
    //                 return found;
    //             } else {
    //                 return null;
    //             }
    //         })
    //         .filter(Util.hasValue);

    //     // if (x === 3 && y === 4) {
    //     //     console.log({x, y}, visibleForPoint);
    //     // }

    //     console.log({x, y}, visibleForPoint.length);
    //     return Math.max(visibleForPoint.length, maxVisible);
    // }, -Infinity);

    const result = asteroids.reduce((maxVisible, asteroid) => {
        const otherAsteroids = asteroids.filter(
            other => !(asteroid.x === other.x && asteroid.y === other.y),
        );

        const sortedOtherAsteroids = R.sortBy(p => p.distance)(
            otherAsteroids.map(other => ({
                ...other,
                distance: distance(asteroid, other),
            })),
        );

        // console.log(asteroid, sortedOtherAsteroids);

        const foundVisible = new Array<Point>();

        const _ = sortedOtherAsteroids.filter(other => {
            const pathToOther = coordinatesInSight(asteroid, other);

            // if (asteroid.x === 3 && asteroid.y === 4) {
            //     console.log(other, pathToOther);
            // }

            if (
                R.all(
                    (coordinate: Point) =>
                        !foundVisible.some(
                            found =>
                                found.x === coordinate.x &&
                                found.y === coordinate.y,
                        ),
                )(pathToOther)
            ) {
                foundVisible.push(other);
            }
        });

        console.log(asteroid, foundVisible.length);

        return Math.max(maxVisible, foundVisible.length);
    }, -Infinity);

    return result;
};

const testInput = `
.#..#
.....
#####
....#
...##
`;

export const run = () => {
    // const input = testInput;

    // const input = R.pipe(
    //     R.trim,
    //     R.split('\n'),
    //     R.map(
    //         R.pipe(
    //             R.trim,
    //             R.split(''),
    //             R.map(x => x === '#'),
    //         ),
    //     ),
    //     // R.transpose,
    // )(testInput);
    const input = R.pipe(
        R.map(
            R.pipe(
                R.trim,
                R.split(''),
                R.map(x => x === '#'),
            ),
        ),
        // R.transpose,
    )(Util.loadInput('10'));

    console.log('Part 1:', part1(input));
};
