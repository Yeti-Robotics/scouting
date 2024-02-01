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

export const selectScoreKey = ({ auto, level }: { auto: boolean; level: 'speaker' | 'amp' }) => {
	if (auto) {
		if (level === 'speaker') {
			return 'autoSpeakerNotes';
		} else {
			return 'autoAmpNotes';
		}
	} else {
		if (level === 'speaker') {
			return 'teleopSpeakerNotes';
		} else {
			return 'teleopAmpNotes';
		}
	}
};

export const getTitle = ({ auto, level }: { auto: boolean; level: 'speaker' | 'amp' }) => {
	if (auto) {
		if (level === 'speaker') {
			return 'autoSpeakerNotes';
		} else {
			return 'autoAmpNotes';
		}
	} else {
		if (level === 'speaker') {
			return 'teleopSpeakerNotes';
		} else {
			return 'teleopAmpNotes';
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
			return 'blue';
		if (
			team?.teamNumber === match.red1?.teamNumber ||
			team?.teamNumber === match.red2?.teamNumber ||
			team?.teamNumber === match.red3?.teamNumber
		)
			return 'red';
	} else {
		if (
			team === match.blue1?.teamNumber ||
			team === match.blue2?.teamNumber ||
			team === match.blue3?.teamNumber
		)
			return 'blue';
		if (
			team === match.red1?.teamNumber ||
			team === match.red2?.teamNumber ||
			team === match.red3?.teamNumber
		)
			return 'red';
	}
	return undefined;
};

const getPiecesScored = (form: StandFormI | undefined) => {
	return {
		ampNotes: (form?.autoAmpNotes ?? 0) + (form?.teleopAmpNotes ?? 0),
		speakerNotes:
			(form?.autoSpeakerNotes ?? 0) +
			(form?.teleopSpeakerNotes ?? 0) +
			(form?.teleopAmplifiedSpeakerNotes ?? 0),
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
			ampNotes: blue1.ampNotes + blue2.ampNotes + blue3.ampNotes,
			speakerNotes: blue1.speakerNotes + blue2.speakerNotes + blue3.speakerNotes,
		},
		red: {
			ampNotes: red1.ampNotes + red2.ampNotes + red3.ampNotes,
			speakerNotes: red1.speakerNotes + red2.speakerNotes + red3.speakerNotes,
		},
	};
};
