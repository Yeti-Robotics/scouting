const testData = {
	frc3506: ['scout1', 'scout2'],
	frc2485: ['scout3', 'scout4'],
	frc4290: ['scout5', 'scout6'],
};

const getScoutCombinations = (data: typeof testData) => {
	const scoutTeams = Object.values(data);
	const combinations = [];

	for (let i = 0; i < 8; i++) {
		combinations.push([
			scoutTeams[0][Math.floor(i / 4)],
			scoutTeams[1][Math.floor(i / 2) % 2],
			scoutTeams[2][Math.floor(i % 2)],
		]);
	}

	return combinations;
};

const scoutScores = {
	scout1: 15,
	scout2: 15,
	scout3: 7,
	scout4: 30,
	scout5: 18,
	scout6: 12,
};

const avgError = (combinations: string[][], scores: typeof scoutScores, tbaScore: number) => {
	const averageError = {};
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
