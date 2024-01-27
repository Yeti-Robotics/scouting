/**
 * Takes the scouters for each match and finds all valid combinations
 * @param allianceScouts: object mapping teams to list of scouter usernames
 * @returns combinations
 */
const getScoutCombinations = <ValidScoutT extends string, ValidTeamT extends string>(
	allianceScouts: Record<ValidTeamT, ValidScoutT[]>,
) => {
	const scoutTeams = Object.values(allianceScouts) as ValidScoutT[][];
	const combinations: ValidScoutT[][] = [];

	for (let i = 0; i < 8; i++) {
		combinations.push([
			scoutTeams[0][Math.floor(i / 4)],
			scoutTeams[1][Math.floor(i / 2) % 2],
			scoutTeams[2][Math.floor(i % 2)],
		]);
	}

	return combinations;
};

/**
 * Finds average error for each scouter based on the alliances they are a part of
 * @param scores: object mapping usernames to reported score
 * @param combinations
 * @param tbaScore: total alliance score reported by tba
 * @returns averageError: object mapping username to average error
 */
const avgError = <ValidScoutT extends string>(
	scores: Record<ValidScoutT, number>,
	combinations: ValidScoutT[][],
	tbaScore: number,
) => {
	const averageError = {} as Record<ValidScoutT, number>;
	combinations.forEach((combo) => {
		const combined = scores[combo[0]] + scores[combo[1]] + scores[combo[2]];
		const error = tbaScore - combined;
		combo.forEach((scout) => {
			if (averageError[scout]) {
				averageError[scout] += Math.abs(error / 4);
			} else {
				averageError[scout] = Math.abs(error / 4);
			}
		});
	});
	return averageError;
};

/*
When calling functions, need to use something like:
type MatchScouts = keyof typeof scoutScores;
type MatchData<T extends string> = {
	[K in keyof typeof testData]: T[]
}
*/

/**
 * Calculate's each scouter's expected contribution to match's error
 * @param scores: object mapping usernames to reported score
 * @param allianceScouts: object mapping teams to list of scouter usernames
 * @param tbaScore: total alliance score reported by tba
 * @returns expectedContribution: object mapping each username to their expected contribution to match's error
 */
const scoutExpectedContribution = <ValidScoutT extends string, ValidTeamT extends string>(
	scores: Record<ValidScoutT, number>,
	allianceScouts: Record<ValidTeamT, ValidScoutT[]>,
	tbaScore: number,
) => {
	const combinations = getScoutCombinations<ValidScoutT, ValidTeamT>(allianceScouts);
	const averageError = avgError<ValidScoutT>(scores, combinations, tbaScore);
	const expectedContribution = {} as Record<ValidScoutT, number>;

	combinations.forEach((combo) => {
		const actualError = Math.abs(
			tbaScore - scores[combo[0]] - scores[combo[1]] - scores[combo[2]],
		);
		combo.forEach((scoutX, index) => {
			const scoutY = combo[(index + 2) % 3];
			const scoutZ = combo[(index + 1) % 3];
			const scoutXExpectedError = Math.abs(
				actualError - (averageError[scoutY] + averageError[scoutZ]) / 3,
			);
			expectedContribution[scoutX] = expectedContribution[scoutX]
				? expectedContribution[scoutX] + scoutXExpectedError / 4
				: scoutXExpectedError / 4;
		});
	});

	return expectedContribution;
};

export default scoutExpectedContribution;
