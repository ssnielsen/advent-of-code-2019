import fs from 'fs';
import * as R from 'ramda';

export const loadInput = (day: string) =>
    R.pipe(
        R.tap(filename => console.log(`Reading file from ${filename}`)),
        (filename: string) => fs.readFileSync(filename, 'utf-8'),
        R.trim,
        R.split('\n'),
    )(`${__dirname}/${day}/input`);

export const hasValue = <T>(value: T | null | undefined): value is T => value !== undefined && value !== null;
