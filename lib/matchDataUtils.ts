import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { MatchI } from '@/models/Match';
import { red, blue } from '@mui/material/colors';

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
			return blue[500];
		if (
			team?.teamNumber === match.red1?.teamNumber ||
			team?.teamNumber === match.red2?.teamNumber ||
			team?.teamNumber === match.red3?.teamNumber
		)
			return red[500];
	} else {
		if (
			team === match.blue1?.teamNumber ||
			team === match.blue2?.teamNumber ||
			team === match.blue3?.teamNumber
		)
			return blue[500];
		if (
			team === match.red1?.teamNumber ||
			team === match.red2?.teamNumber ||
			team === match.red3?.teamNumber
		)
			return red[500];
	}
	return 'none';
};
