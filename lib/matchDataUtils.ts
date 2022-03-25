import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { MatchI } from '@/models/Match';
import { blue, red } from '@mui/material/colors';

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
	low,
}: {
	auto: boolean;
	low: boolean;
}): keyof StandFormWithName => {
	if (auto && low) return 'autoLowBallsScored';
	if (auto && !low) return 'autoUpperBallsScored';
	if (!auto && low) return 'teleopLowBallsScored';
	if (!auto && !low) return 'teleopUpperBallsScored';
	throw new Error('How did we get here?');
};

export const getTitle = ({ auto, low }: { auto: boolean; low: boolean }) => {
	if (auto && low) return 'Auto Low Balls';
	if (auto && !low) return 'Auto Upper Balls';
	if (!auto && low) return 'Teleop Low Balls';
	if (!auto && !low) return 'Teleop Upper Balls';
	throw new Error('How did we get here? 2');
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
