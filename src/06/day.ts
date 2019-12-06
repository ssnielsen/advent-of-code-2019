import {Map, List} from 'immutable';

import * as Util from '../util';

interface Pair {
    orbitter: string;
    orbitee: string;
}

type Planets = Map<string, List<string>>;

const countOrbits = (planet: string, planets: Planets): number => {
    const orbits = planets.get(planet, List<string>());

    return (
        orbits.size +
        orbits.reduce(
            (total, orbitee) => total + countOrbits(orbitee, planets),
            0,
        )
    );
};

const part1 = (system: Pair[]) => {
    const planets = system.reduce((planets, {orbitee, orbitter}) => {
        return planets.update(orbitter, orbits =>
            (orbits ?? List<string>()).push(orbitee),
        );
    }, Map<string, List<string>>());

    const totalOrbits = planets.reduce((totalOrbits, orbits, planet) => {
        return totalOrbits + countOrbits(planet, planets);
    }, 0);

    return totalOrbits;
};

export const run = () => {
    const system = Util.loadInput('06').map(line => {
        const [orbitee, orbitter] = line.split(')');
        return {orbitee, orbitter};
    });

    console.log('Part 1:', part1(system));
};
