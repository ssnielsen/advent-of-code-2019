import {Map, List} from 'immutable';

import * as Util from '../util';

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

const orbitPath = (planet: string, planets: Planets): string[] => {
    const orbits = planets.get(planet, List<string>());

    return [
        ...orbits.toArray(),
        ...orbits.reduce((others, orbitee) => {
            return [...others, ...orbitPath(orbitee, planets)];
        }, new Array<string>()),
    ];
};

const testInput =
    'COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN';

const part1 = (planets: Planets) => {
    const totalOrbits = planets.reduce((totalOrbits, orbits, planet) => {
        return totalOrbits + countOrbits(planet, planets);
    }, 0);

    return totalOrbits;
};

const part2 = (planets: Planets) => {
    const pathFromYOU = orbitPath('YOU', planets).reverse();
    const pathFromSAN = orbitPath('SAN', planets).reverse();

    let i = 0;

    while (pathFromSAN[i] === pathFromYOU[i]) {
        i++;
    }

    return pathFromSAN.length - i + (pathFromYOU.length - i);
};

export const run = () => {
    const planets = Util.loadInput('06')
        .map(line => {
            const [orbitee, orbitter] = line.split(')');
            return {orbitee, orbitter};
        })
        .reduce((planets, {orbitee, orbitter}) => {
            return planets.update(orbitter, orbits =>
                (orbits ?? List<string>()).push(orbitee),
            );
        }, Map<string, List<string>>());

    console.log('Part 1:', part1(planets));
    console.log('Part 2:', part2(planets));
};
