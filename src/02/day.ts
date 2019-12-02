import * as R from 'ramda';

import * as Util from '../util';

type Program = number[];

const execute = (program: Program, pointer: number = 0): number[] => {
    const instruction = program[pointer];
    const opPointer1 = program[pointer + 1];
    const opPointer2 = program[pointer + 2];
    const op1 = program[opPointer1];
    const op2 = program[opPointer2];
    const destination = program[pointer + 3];

    switch (instruction) {
        case 1: // Add
            program[destination] = op1 + op2;
            return execute(program, pointer + 4);
        case 2: // Mul
            program[destination] = op1 * op2;
            return execute(program, pointer + 4);
        case 99: // Halt
            return program;
        default:
            throw new Error('Unknown operation code');
    }
};

const copyProgram = (program: Program) => Array.from(program);

const part1 = (program: Program) => {
    const programCopy = copyProgram(program);
    programCopy[1] = 12;
    programCopy[2] = 2;
    return execute(programCopy)[0];
};

const part2 = (program: Program, target: number) => {
    // for (let noun = 0; noun <= 99; noun++) {
    //     for (let verb = 0; verb <= 99; verb++) {
    //         const programCopy = copyProgram(program);
    //         programCopy[1] = noun;
    //         programCopy[2] = verb;
    //         const result = execute(programCopy);

    //         if (result[0] === target) {
    //             return 100 * noun + verb;
    //         }
    //     }
    // }

    return R.pipe(
        (from: number, to: number) => R.xprod(R.range(from, to + 1), R.range(from, to + 1)),
        R.takeWhile(([noun, verb]) => {
            const programCopy = copyProgram(program);
            programCopy[1] = noun;
            programCopy[2] = verb;
            const result = execute(programCopy);
            return result[0] !== target;
        }),
        R.last,
        ([noun, verb]: [number, number]) => 100 * noun + verb,
    )(0, 99);
};

export const run = () => {
    const program = Util.loadInput('02')[0]
        .split(',')
        .map(Number);

    console.log('Part 1:', part1(program));
    console.log('Part 2:', part2(program, 19690720));
};
