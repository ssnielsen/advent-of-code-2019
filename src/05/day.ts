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
    const opPointer3 = program[pointer + 3];
    const op1 =
        parmsInOrder.charAt(0) === '1' ? opPointer1 : program[opPointer1];
    const op2 =
        parmsInOrder.charAt(1) === '1' ? opPointer2 : program[opPointer2];

    switch (Number(opCode)) {
        case 1: // Add
            program[opPointer3] = op1 + op2;
            return execute(program, input, pointer + 4, outputs);
        case 2: // Mul
            program[opPointer3] = op1 * op2;
            return execute(program, input, pointer + 4, outputs);
        case 3: // Save input to mem
            program[opPointer1] = input;
            return execute(program, input, pointer + 2, outputs);
        case 4: // Read output from mem
            return execute(program, input, pointer + 2, [...outputs, op1]);
        case 5: // Jump if true
            return execute(
                program,
                input,
                op1 !== 0 ? op2 : pointer + 3,
                outputs,
            );
        case 6: // Jump if false
            return execute(
                program,
                input,
                op1 === 0 ? op2 : pointer + 3,
                outputs,
            );
        case 7: // Less than
            program[opPointer3] = op1 < op2 ? 1 : 0;
            return execute(program, input, pointer + 4, outputs);
        case 8: //  Equals
            program[opPointer3] = op1 === op2 ? 1 : 0;
            return execute(program, input, pointer + 4, outputs);
        case 99: // Halt
            return {program, outputs};
        default:
            throw new Error(`Unknown operation code: ${opCode}`);
    }
};

const copyProgram = (program: Program) => Array.from(program);

const part1 = (program: Program) => {
    const programCopy = copyProgram(program);
    const {program: result, outputs} = execute(programCopy, 1);
    return outputs[outputs.length - 1];
};

const part2 = (program: Program) => {
    const programCopy = copyProgram(program);
    const {program: result, outputs} = execute(programCopy, 5);
    return outputs[outputs.length - 1];
};

export const run = () => {
    // Tests for Part 1
    // const testInput = '3,0,4,0,99';
    // const testInput = '1002,4,3,4,33';
    // const testInput = '1101,100,-1,4,0';
    // const program = testInput.split(',').map(Number);

    // Tests for Part 2
    // const testInput = '3,9,8,9,10,9,4,9,99,-1,8'; // Equal to 8 - pos mode
    // const testInput = '3,9,7,9,10,9,4,9,99,-1,8'; // Less than 8 - pos mode
    // const testInput = '3,3,1108,-1,8,3,4,3,99'; // Equal to 8 - immediate mode
    // const testInput = '3,3,1107,-1,8,3,4,3,99'; // Less than 8 - immediate mode
    // const testInput = '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9'; // Equal to 0 - pos mode
    // const testInput = '3,3,1105,-1,9,1101,0,0,12,4,12,99,1'; // Equal to 0 - immediate mode

    /*
    The program will then output 999 if the input value is below 8, output 1000 if the input value is equal to 8, or output 1001 if the input value is greater than 8.
     */
    // const testInput =
    //     '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99';

    // const program = testInput.split(',').map(Number);

    const program = loadInput('05')[0]
        .split(',')
        .map(Number);

    console.log('Part 1:', part1(program));
    console.log('Part 2:', part2(program));
};
