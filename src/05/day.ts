import * as R from 'ramda';
import {loadInput} from '../util';

type Program = number[];

const execute = (
    program: Program,
    input: number,
    pointer: number = 0,
    outputs: number[] = [],
): {program: number[]; outputs: number[]} => {
    const instruction = String(program[pointer]);

    const [parms, opCode] = R.splitAt(instruction.length - 2, instruction);
    const parmsInOrder = parms
        .split('')
        .reverse()
        .join('');

    const opPointer1 = program[pointer + 1];
    const opPointer2 = program[pointer + 2];
    const op1 =
        parmsInOrder.charAt(0) === '1' ? opPointer1 : program[opPointer1];
    const op2 =
        parmsInOrder.charAt(1) === '1' ? opPointer2 : program[opPointer2];
    const destination = program[pointer + 3];

    switch (Number(opCode)) {
        case 1: // Add
            program[destination] = op1 + op2;
            return execute(program, input, pointer + 4, outputs);
        case 2: // Mul
            program[destination] = op1 * op2;
            return execute(program, input, pointer + 4, outputs);
        case 3: // Save input to mem
            program[opPointer1] = input;
            return execute(program, input, pointer + 2, outputs);
        case 4: // Read output from mem
            return execute(program, input, pointer + 2, [...outputs, op1]);
        case 99: // Halt
            return {program, outputs};
        default:
            throw new Error(`Unknown operation code: ${opCode}`);
    }
};

const part1 = (program: Program) => {
    const {program: result, outputs} = execute(program, 1);

    console.log('End state:', result);
    console.log('Outputs:', outputs);

    return 0;
};

export const run = () => {
    // const testInput = '3,0,4,0,99';
    // const testInput = '1002,4,3,4,33';
    // const testInput = '1101,100,-1,4,0';
    // const program = testInput.split(',').map(Number);

    const program = loadInput('05')[0]
        .split(',')
        .map(Number);

    console.log('Part 1:', part1(program));
};
