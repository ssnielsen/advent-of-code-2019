import * as R from 'ramda';

import {loadInput} from '../util';

type Program = number[];
type LargeProgram = {[key: number]: number};

enum Mode {
    position = '0',
    immediate = '1',
    relative = '2',
}

const getOperand = (
    params: String,
    program: LargeProgram,
    pointer: number,
    delta: number,
    relativeBase: number,
) => {
    const opPointer = program[pointer + delta];
    const modeFlag = params.charAt(delta - 1);

    switch (modeFlag) {
        case Mode.immediate:
            return opPointer;
        case Mode.relative:
            return delta === 3
                ? relativeBase + opPointer
                : program[relativeBase + opPointer];
        case Mode.position:
        default:
            // Memory not being assigned yet should return zero.
            return delta === 3 ? opPointer : program[opPointer] || 0;
    }
};

const execute = (
    program: LargeProgram,
    input: number[] = [],
    pointer: number = 0,
    outputs: number[] = [],
    relativeBase: number = 0,
): {
    program: LargeProgram;
    outputs: number[];
    halted: boolean;
    pointer: number;
} => {
    const instruction = String(program[pointer]);
    const [parms, opCode] = R.splitAt(instruction.length - 2, instruction);
    const parmsInOrder = parms
        .split('')
        .reverse()
        .join('');

    const op1 = getOperand(parmsInOrder, program, pointer, 1, relativeBase);
    const op2 = getOperand(parmsInOrder, program, pointer, 2, relativeBase);
    const op3 = getOperand(parmsInOrder, program, pointer, 3, relativeBase);

    switch (Number(opCode)) {
        case 1: // Add
            program[op3] = op1 + op2;
            return execute(program, input, pointer + 4, outputs, relativeBase);
        case 2: // Mul
            program[op3] = op1 * op2;
            return execute(program, input, pointer + 4, outputs, relativeBase);
        case 3: // Save input to mem
            if (input.length === 0) {
                // throw Error('No inputs left!');
                return {program, outputs, halted: false, pointer: pointer};
            }
            const mode = parmsInOrder.charAt(0);
            switch (mode) {
                case '2':
                    program[relativeBase + (program[pointer + 1] || 0)] =
                        input[0];
                    break;
                default:
                    program[op1] = input[0];
            }
            return execute(
                program,
                input.slice(1),
                pointer + 2,
                outputs,
                relativeBase,
            );
        case 4: // Read output from mem
            return execute(
                program,
                input,
                pointer + 2,
                [...outputs, op1],
                relativeBase,
            );
        case 5: // Jump if true
            return execute(
                program,
                input,
                op1 !== 0 ? op2 : pointer + 3,
                outputs,
                relativeBase,
            );
        case 6: // Jump if false
            return execute(
                program,
                input,
                op1 === 0 ? op2 : pointer + 3,
                outputs,
                relativeBase,
            );
        case 7: // Less than
            program[op3] = op1 < op2 ? 1 : 0;
            return execute(program, input, pointer + 4, outputs, relativeBase);
        case 8: //  Equals
            program[op3] = op1 === op2 ? 1 : 0;
            return execute(program, input, pointer + 4, outputs, relativeBase);
        case 9: // Adjust relative base
            return execute(
                program,
                input,
                pointer + 2,
                outputs,
                relativeBase + op1,
            );
        case 99: // Halt
            return {program, outputs, halted: true, pointer};
        default:
            throw new Error(`Unknown operation code: ${opCode}`);
    }
};

const executeNew = (program: LargeProgram, input: number[] = []) => {
    let pointer = 0;
    let outputs = new Array<number>();
    let relativeBase = 0;
    let inputs = [...input];

    while (true) {
        const instruction = String(program[pointer]);
        const [parms, opCode] = R.splitAt(instruction.length - 2, instruction);
        const parmsInOrder = parms
            .split('')
            .reverse()
            .join('');

        const op1 = getOperand(parmsInOrder, program, pointer, 1, relativeBase);
        const op2 = getOperand(parmsInOrder, program, pointer, 2, relativeBase);
        const op3 = getOperand(parmsInOrder, program, pointer, 3, relativeBase);

        switch (Number(opCode)) {
            case 1: // Add
                program[op3] = op1 + op2;
                pointer += 4;
                continue;
            case 2: // Mul
                program[op3] = op1 * op2;
                pointer += 4;
                continue;
            case 3: // Save input to mem
                if (inputs.length === 0) {
                    // throw Error('No inputs left!');
                    return {program, outputs, halted: false, pointer: pointer};
                }
                const mode = parmsInOrder.charAt(0);
                switch (mode) {
                    case '2':
                        program[relativeBase + (program[pointer + 1] || 0)] =
                            input[0];
                        break;
                    default:
                        program[op1] = input[0];
                }
                pointer += 2;
                inputs = inputs.slice(1);
                continue;
            case 4: // Read output from mem
                outputs = [...outputs, op1];
                pointer += 2;
                continue;
            case 5: // Jump if true
                pointer = op1 !== 0 ? op2 : pointer + 3;
                continue;
            case 6: // Jump if false
                pointer = op1 === 0 ? op2 : pointer + 3;
                continue;
            case 7: // Less than
                program[op3] = op1 < op2 ? 1 : 0;
                pointer += 4;
                continue;
            case 8: //  Equals
                program[op3] = op1 === op2 ? 1 : 0;
                pointer += 4;
                continue;
            case 9: // Adjust relative base
                relativeBase += op1;
                pointer += 2;
                continue;
            case 99: // Halt
                return {program, outputs, halted: true, pointer};
            default:
                throw new Error(`Unknown operation code: ${opCode}`);
        }
    }
};

const copyProgram = (program: Program): LargeProgram => {
    return Object.keys(program).reduce((o, k) => {
        return {
            ...o,
            [k]: program[Number(k)],
        };
    }, {});
};

const part1 = (program: Program) => {
    const programCopy = copyProgram(program);
    return executeNew(programCopy, [1]).outputs;
};

const part2 = (program: Program) => {
    const programCopy = copyProgram(program);
    return executeNew(programCopy, [2]).outputs;
};

export const run = () => {
    // const largeNumberTest = '104,1125899906842624,99';
    // const largeNumberProgram = largeNumberTest.split(',').map(Number);
    // const _16digitOutput = '1102,34915192,34915192,7,4,7,99,0';
    // const _16digitprogram = _16digitOutput.split(',').map(Number);
    // const selfCopying =
    //     '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
    // const selfCopyingprogram = selfCopying.split(',').map(Number);

    // console.log('Large number test:', part1(largeNumberProgram));
    // console.log('16 digit:', part1(_16digitprogram));
    // console.log('Self copying:', part1(selfCopyingprogram).join(','));

    const program = loadInput('09')[0]
        .split(',')
        .map(Number);

    console.log('Part 1:', part1(program));
    console.log('Part 2:', part2(program));
};
