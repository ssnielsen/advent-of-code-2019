import * as R from 'ramda';

import * as Util from '../util';

const getDestination = (x: number, y: number, instruction: string) => {
    const direction = R.head(instruction);
    const distance = Number(R.tail(instruction));

    switch (direction) {
        case 'R':
            return {
                x: x + distance,
                y,
            };
        case 'U':
            return {
                x,
                y: y + distance,
            };
        case 'L':
            return {
                x: x - distance,
                y,
            };
        case 'D':
            return {
                x,
                y: y - distance,
            };
        default:
            throw new Error(`Unknown direction '${direction}'. Expected 'R', 'U', 'L', or 'D'.`);
    }
};

interface Point {
    x: number;
    y: number;
}

interface Line {
    from: Point;
    to: Point;
}

const convertToLines = (input: string[]) => {
    return input.reduce(
        ({x, y, lines}, instruction) => {
            const destination = getDestination(x, y, instruction);
            return {
                ...destination,
                lines: [...lines, {from: {x, y}, to: destination}],
            };
        },
        {x: 0, y: 0, lines: new Array<{from: Point; to: Point}>()},
    ).lines;
};

const parse = (input: string[]) => {
    const [wire1, wire2] = input.map(wire => wire.split(','));

    return R.xprod(convertToLines(wire1), convertToLines(wire2));
};

// const between = (a: number, b: number, c: number) => {
//     return a < b && b < c;
// };

// const _l1 = {
//     from: {x: 3, y: 5},
//     to: {x: 3, y: 2},
// };

// const _l2 = {
//     from: {x: 6, y: 3},
//     to: {x: 2, y: 3},
// };

const samePoint = (p1: Point, p2: Point) => {
    return p1.x === p2.x && p1.y === p2.y;
};

const sameLine = (l1: Line, l2: Line) => {
    return samePoint(l1.from, l2.from) && samePoint(l1.to, l2.to);
};

const crossesAt = (l1: Line, l2: Line) => {
    // if (sameLine(l1, _l1) && sameLine(l2, _l2)) {
    //     console.log('XXXX');
    // }

    if (
        Math.min(l1.from.x, l1.to.x) < l2.from.x &&
        l2.from.x < Math.max(l1.from.x, l1.to.x) &&
        Math.min(l2.from.y, l2.to.y) < l1.from.y &&
        l1.from.y < Math.max(l2.from.y, l2.to.y)
    ) {
        return {
            x: l2.from.x,
            y: l1.from.y,
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
        };
    }
};

const manhattanDistance = (p1: Point, p2: Point) => {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
};

const printLine = (line: Line) => {
    return `(x: ${line.from.x}, y: ${line.from.y}) -> (x: ${line.to.x}, y: ${line.to.y})`;
};

const hasValue = <T>(value: T | null | undefined): value is T => value !== undefined && value !== null;

const part1 = (input: string[]) => {
    const linePairs = parse(input);

    const crossings = linePairs
        .map(([l1, l2]) => {
            return crossesAt(l1, l2);
        })
        .filter(hasValue);

    const origin = {x: 0, y: 0};
    const closest = R.sortBy(p => manhattanDistance(origin, p))(crossings)[0];
    return manhattanDistance(origin, closest);
};

export const run = () => {
    // const input = 'R8,U5,L5,D3\nU7,R6,D4,L4'.split('\n');
    // const input = 'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83'.split('\n');;
    // const input = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7';

    const input = Util.loadInput('03');

    console.log('Part 1:', part1(input));
};
