import * as R from 'ramda';

import * as Util from '../util';

const getDestination = (x: number, y: number, instruction: string) => {
    const direction = R.head(instruction);
    const distance = Number(R.tail(instruction));

    if (!distance) {
        throw Error(`Could not parse distance in instruction ${instruction}`);
    }

    switch (direction) {
        case 'R':
            return {x: x + distance, y};
        case 'U':
            return {x, y: y + distance};
        case 'L':
            return {x: x - distance, y};
        case 'D':
            return {x, y: y - distance};
        default:
            throw Error(`Unknown direction '${direction}'. Expected 'R', 'U', 'L', or 'D'.`);
    }
};

interface Point {
    x: number;
    y: number;
}

type PointWithStep = Point & {steps: number};

interface Line {
    from: PointWithStep;
    to: PointWithStep;
}

const convertToLines = (input: string[]) => {
    return input.reduce(
        ({x, y, steps, lines}, instruction) => {
            const destination = getDestination(x, y, instruction);
            const distance = Number(R.tail(instruction));

            // const prevLine = lines.find(line => {
            //     if (line.to.x === destination.x && line.to.y === destination.y) {
            //         return line.to;
            //     } else if (line.from.x === destination.x && line.from.y === destination.y) {
            //         return line.from;
            //     }
            // });

            // // const stepsForTo =
            // //     ((prevLine
            // //         ? prevLine?.to.x === destination.x && prevLine?.to.y === destination.y
            // //             ? prevLine.to.steps
            // //             : prevLine.from.steps
            // //         : null) ?? steps) + distance;

            const distanceSoFar = steps + distance;

            return {
                ...destination,
                steps: distanceSoFar,
                lines: [
                    ...lines,
                    {from: {x, y, steps}, to: {x: destination.x, y: destination.y, steps: distanceSoFar}},
                ],
            };
        },
        {x: 0, y: 0, steps: 0, lines: new Array<{from: PointWithStep; to: PointWithStep}>()},
    ).lines;
};

// Make a list with all combinations of lines from the two wires
const parse = (input: string[]) => {
    const [wire1, wire2] = input.map(wire => wire.split(','));
    return R.xprod(convertToLines(wire1), convertToLines(wire2));
};

// This assumes that we're working with lines that are parallel to the axes and that they are perpendicular
const crossesAt = (l1: Line, l2: Line) => {
    if (
        Math.min(l1.from.x, l1.to.x) < l2.from.x &&
        l2.from.x < Math.max(l1.from.x, l1.to.x) &&
        Math.min(l2.from.y, l2.to.y) < l1.from.y &&
        l1.from.y < Math.max(l2.from.y, l2.to.y)
    ) {
        return {
            x: l2.from.x,
            y: l1.from.y,
            steps: l1.from.steps + Math.abs(l1.from.x - l2.from.x) + l2.from.steps + Math.abs(l1.from.y - l2.from.y),
        };
    }

    if (
        Math.min(l2.from.x, l2.to.x) < l1.from.x &&
        l1.from.x < Math.max(l2.from.x, l2.to.x) &&
        Math.min(l1.from.y, l1.to.y) < l2.from.y &&
        l2.from.y < Math.max(l1.from.y, l1.to.y)
    ) {
        return {
            x: l1.from.x,
            y: l2.from.y,
            steps: l1.from.steps + Math.abs(l1.from.x - l2.from.x) + l2.from.steps + Math.abs(l1.from.y - l2.from.y),
        };
    }
};

const manhattanDistance = (p1: Point, p2: Point) => {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
};

const part1 = (input: string[]) => {
    const linePairs = parse(input);

    const crossings = linePairs
        .map(([l1, l2]) => {
            return crossesAt(l1, l2);
        })
        .filter(Util.hasValue);

    const origin = {x: 0, y: 0};
    const closest = R.sortBy(p => manhattanDistance(origin, p))(crossings)[0];
    return manhattanDistance(origin, closest);
};

const part2 = (input: string[]) => {
    const linePairs = parse(input);

    const crossings = linePairs
        .map(([l1, l2]) => {
            return crossesAt(l1, l2);
        })
        .filter(Util.hasValue);

    const closest = R.sortBy(p => p.steps)(crossings)[0];
    return closest.steps;
};

export const run = () => {
    // const input = 'R8,U5,L5,D3\nU7,R6,D4,L4'.split('\n');
    // const input = 'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83'.split('\n');
    // const input = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split('\n');

    const input = Util.loadInput('03');

    console.log('Part 1:', part1(input));
    console.log('Part 2:', part2(input));
};
