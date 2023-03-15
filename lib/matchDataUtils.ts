import { MatchData } from '@/models/aggregations/matchData';
import { MatchWForms } from '@/models/aggregations/matchWForms';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { MatchI } from '@/models/Match';
import { StandFormI } from '@/models/StandForm';

export const getAllData = (match: MatchData, key: keyof StandFormWithName, ifUndef: any = 0) => {
	const keys = ['blue1', 'blue2', 'blue3', 'red1', 'red2', 'red3'] as const;

	return keys.map((teamKey) => match[teamKey]?.[key] || ifUndef);
};

export const loopTeams = (match: MatchData, func: (team?: StandFormWithName) => void) => {
	const keys = ['blue1', 'blue2', 'blue3', 'red1', 'red2', 'red3'] as const;

	return keys.forEach((key) => func(match[key]));
};

export const filterTeams = (match: MatchData, func: (team?: StandFormWithName) => boolean) => {
	const keys = ['blue1', 'blue2', 'blue3', 'red1', 'red2', 'red3'] as const;

	return keys.filter((key) => func(match[key])).map((key) => match[key]);
};

export const selectScoreKey = ({
	auto,
	level,
	piece,
}: {
	auto: boolean;
	level: 'top' | 'mid' | 'low';
	piece: 'cone' | 'cube';
}): keyof StandFormWithName => {
	if (auto) {
		if (level === 'top') {
			if (piece === 'cone') {
				return 'autoTopCones';
			} else {
				return 'autoTopCubes';
			}
		} else if (level === 'mid') {
			if (piece === 'cone') {
				return 'autoMidCones';
			} else {
				return 'autoMidCubes';
			}
		} else {
			if (piece === 'cone') {
				return 'autoLowCones';
			} else {
				return 'autoLowCubes';
			}
		}
	} else {
		if (level === 'top') {
			if (piece === 'cone') {
				return 'teleopTopCones';
			} else {
				return 'teleopTopCubes';
			}
		} else if (level === 'mid') {
			if (piece === 'cone') {
				return 'teleopMidCones';
			} else {
				return 'teleopMidCubes';
			}
		} else {
			if (piece === 'cone') {
				return 'teleopLowCones';
			} else {
				return 'teleopLowCubes';
			}
		}
	}
};

export const getTitle = ({
	auto,
	level,
	piece,
}: {
	auto: boolean;
	level: 'top' | 'mid' | 'low';
	piece: 'cone' | 'cube';
}) => {
	if (auto) {
		if (level === 'top') {
			if (piece === 'cone') {
				return 'Top Cones Auto';
			} else {
				return 'Top Cubes Auto';
			}
		} else if (level === 'mid') {
			if (piece === 'cone') {
				return 'Mid Cones Auto';
			} else {
				return 'Mid Cubes Auto';
			}
		} else {
			if (piece === 'cone') {
				return 'Low Cones Auto';
			} else {
				return 'Low Cubes Auto';
			}
		}
	} else {
		if (level === 'top') {
			if (piece === 'cone') {
				return 'Top Cones Teleop';
			} else {
				return 'Top Cubes Teleop';
			}
		} else if (level === 'mid') {
			if (piece === 'cone') {
				return 'Mid Cones Teleop';
			} else {
				return 'Mid Cubes Teleop';
			}
		} else {
			if (piece === 'cone') {
				return 'Low Cones Teleop';
			} else {
				return 'Low Cubes Teleop';
			}
		}
	}
};

export const hasTeam = (match: MatchData | MatchI, team: number) => {
	return match.bets
		? match.blue1 === team ||
				match.blue2 === team ||
				match.blue3 === team ||
				match.red1 === team ||
				match.red2 === team ||
				match.red3 === team
		: match.blue1?.teamNumber === team ||
				match.blue2?.teamNumber === team ||
				match.blue3?.teamNumber === team ||
				match.red1?.teamNumber === team ||
				match.red2?.teamNumber === team ||
				match.red3?.teamNumber === team;
};

export const getTeamColor = (match: MatchData, team?: StandFormWithName | number) => {
	if (typeof team !== 'number') {
		if (
			team?.teamNumber === match.blue1?.teamNumber ||
			team?.teamNumber === match.blue2?.teamNumber ||
			team?.teamNumber === match.blue3?.teamNumber
		)
			return '#00ff00';
		if (
			team?.teamNumber === match.red1?.teamNumber ||
			team?.teamNumber === match.red2?.teamNumber ||
			team?.teamNumber === match.red3?.teamNumber
		)
			return '#ff0000';
	} else {
		if (
			team === match.blue1?.teamNumber ||
			team === match.blue2?.teamNumber ||
			team === match.blue3?.teamNumber
		)
			return '#00ff00';
		if (
			team === match.red1?.teamNumber ||
			team === match.red2?.teamNumber ||
			team === match.red3?.teamNumber
		)
			return '#ff0000';
	}
	return 'none';
};

const getPiecesScored = (form: StandFormI | undefined) => {
	return {
		lowCubes: (form?.autoLowCubes ?? 0) + (form?.teleopLowCubes ?? 0),
		lowCones: (form?.autoLowCones ?? 0) + (form?.teleopLowCones ?? 0),
		midCubes: (form?.autoMidCubes ?? 0) + (form?.teleopMidCubes ?? 0),
		midCones: (form?.autoMidCones ?? 0) + (form?.teleopMidCones ?? 0),
		highCubes: (form?.autoTopCubes ?? 0) + (form?.teleopTopCubes ?? 0),
		highCones: (form?.autoTopCones ?? 0) + (form?.teleopTopCones ?? 0),
	};
};

export const aggregatePiecesScored = (match: MatchWForms) => {
	const blue1 = getPiecesScored(match.blue1);
	const blue2 = getPiecesScored(match.blue2);
	const blue3 = getPiecesScored(match.blue3);
	const red1 = getPiecesScored(match.red1);
	const red2 = getPiecesScored(match.red2);
	const red3 = getPiecesScored(match.red3);

	return {
		blue: {
			lowCubes: blue1.lowCubes + blue2.lowCubes + blue3.lowCubes,
			lowCones: blue1.lowCones + blue2.lowCones + blue3.lowCones,
			midCubes: blue1.midCubes + blue2.midCubes + blue3.midCubes,
			midCones: blue1.midCones + blue2.midCones + blue3.midCones,
			highCubes: blue1.highCubes + blue2.highCubes + blue3.highCubes,
			highCones: blue1.highCones + blue2.highCones + blue3.highCones,
		},
		red: {
			lowCubes: red1.lowCubes + red2.lowCubes + red3.lowCubes,
			lowCones: red1.lowCones + red2.lowCones + red3.lowCones,
			midCubes: red1.midCubes + red2.midCubes + red3.midCubes,
			midCones: red1.midCones + red2.midCones + red3.midCones,
			highCubes: red1.highCubes + red2.highCubes + red3.highCubes,
			highCones: red1.highCones + red2.highCones + red3.highCones,
		},
	};
};
