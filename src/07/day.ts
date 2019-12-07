import * as R from 'ramda';
import Combinatorics from 'js-combinatorics';

import {loadInput} from '../util';

type Program = number[];

const execute = (
    program: Program,
    input: number[],
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
            if (input.length === 0) {
                throw Error('No inputs left!');
            }
            program[opPointer1] = input[0];
            return execute(program, input.slice(1), pointer + 2, outputs);
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
    const allCombinations = Combinatorics.permutation([0, 1, 2, 3, 4]).map(
        x => x,
    );

    const result = allCombinations.reduce(
        (largestOutput, phaseSettings) => {
            const output = phaseSettings.reduce((output, phaseSetting, i) => {
                const programCopy = copyProgram(program);
                const {outputs: programOutputs} = execute(programCopy, [
                    phaseSetting,
                    output,
                ]);

                return programOutputs[0];
            }, 0);

            console.log(output, phaseSettings);

            return output > largestOutput.output
                ? {output, phaseSettings}
                : largestOutput;
        },
        {output: -Infinity, phaseSettings: new Array<number>()},
    );

    return result;
};

// const part2 = (program: Program) => {
//     const programCopy = copyProgram(program);
//     const {program: result, outputs} = execute(programCopy, [5]);
//     return outputs[outputs.length - 1];
// };

export const run = () => {
    // Tests for Part 1
    // const testInput = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
    // const testInput =
    //     '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
    // const testInput =
    //     '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';

    // const program = testInput.split(',').map(Number);

    const program = loadInput('07')[0]
        .split(',')
        .map(Number);

    console.log('Part 1:', part1(program));
    // console.log('Part 2:', part2(program));
};
