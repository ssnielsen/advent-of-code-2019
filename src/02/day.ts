import * as Util from '../util';

type Program = number[];

const print = (program: Program) => {
    console.log(program.join(' '));
};

const execute = (program: Program, pointer: number = 0): number[] => {
    // print(program);
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

const part1 = (program: Program) => {
    return execute(program)[0];
};

export const run = () => {
    const inputData = Util.loadInput('02')[0]
        .split(',')
        .map(Number);

    // // const inputData = '1,9,10,3,2,3,11,0,99,30,40,50'.split(',').map(Number);
    // const inputData = '2,4,4,5,99,0'.split(',').map(Number);

    inputData[1] = 12;
    inputData[2] = 2;

    console.log('Part 1', part1(inputData));
    console.log('Done');
};
