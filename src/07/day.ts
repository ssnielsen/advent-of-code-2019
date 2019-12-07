import * as R from 'ramda';
import Combinatorics from 'js-combinatorics';

import {loadInput} from '../util';

type Program = number[];

const execute = (
    program: Program,
    input: number[],
    pointer: number = 0,
    outputs: number[] = [],
): {program: number[]; outputs: number[]; halted: boolean; pointer: number} => {
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
                // throw Error('No inputs left!');
                return {program, outputs, halted: false, pointer: pointer};
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
            return {program, outputs, halted: true, pointer};
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
            const output = phaseSettings.reduce((output, phaseSetting) => {
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

const part2 = (program: Program) => {
    const allCombinations = Combinatorics.permutation([5, 6, 7, 8, 9]).map(
        x => x,
    );

    const result = allCombinations.reduce(
        (largestOutput, phaseSettings) => {
            const amps = Array<ReturnType<typeof execute>>();
            phaseSettings.forEach((phaseSetting, i) => {
                const programCopy = copyProgram(program);
                const prevOutput = i === 0 ? 0 : R.last(amps[i - 1].outputs);
                amps[i] = execute(programCopy, [phaseSetting, prevOutput!]);
            });

            let halted = false;

            while (!halted) {
                R.range(0, 5).forEach(i => {
                    const prevIndex = i === 0 ? 4 : i - 1;
                    const prevAmp = amps[prevIndex];
                    const amp = amps[i];

                    const iteratedAmp = execute(
                        amp.program,
                        [R.last(prevAmp.outputs)!],
                        amp.pointer,
                    );

                    amps[i] = iteratedAmp;

                    if (iteratedAmp.halted) {
                        halted = true;
                    }
                });
            }

            const output = R.last(amps)!.outputs[0];

            return output > largestOutput.output
                ? {output, phaseSettings}
                : largestOutput;
        },
        {output: -Infinity, phaseSettings: new Array<number>()},
    );

    return result;
};

export const run = () => {
    // Tests for Part 1
    // const testInput = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
    // const testInput =
    //     '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
    // const testInput =
    //     '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';

    // Tests for Part 2
    // const testInput =
    //     '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';

    // const testInput =
    //     '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10';

    // const program = testInput.split(',').map(Number);

    const program = loadInput('07')[0]
        .split(',')
        .map(Number);

    console.log('Part 1:', part1(program));
    console.log('Part 2:', part2(program));
};
