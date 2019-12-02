import * as Util from '../util';

enum Op {
    Add = 1,
    Mul = 2,
    Halt = 99,
}

type Program = number[];

const execute = (program: Program, pointer: number = 0): number[] => {
    switch (program[pointer]) {
        case 1: // Add
            program[program[pointer + 3]] = program[pointer + 1] + program[pointer + 2];
            return execute(program, pointer + 4);
        case 2: // Mul
            program[program[pointer + 3]] = program[pointer + 1] * program[pointer + 2];
            return execute(program, pointer + 4);
        case 99: // Halt
            return program;
        default:
            throw new Error('Unknown operation code');
    }
};

const part1 = (program: Program) => {
    return execute(program)[0];
};

export const run = () => {
    // const inputData = Util.loadInput('02')[0]
    //     .split(',')
    //     .map(Number);

    const inputData = '1,9,10,3,2,3,11,0,99,30,40,50'.split(',').map(Number);

    console.log('Part 1', part1(inputData));
    console.log('Done');
};
