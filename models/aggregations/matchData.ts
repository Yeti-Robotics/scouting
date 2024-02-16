import Match, { MatchI } from '../Match';
import StandForm from '../StandForm';
import { StandFormWithName, withNameAggregation } from './standFormWithName';

// sus custom aggregation 😈
export const getMatchData = async (id: string): Promise<MatchData | null> => {
	const matchQuery = await Match.findById(id);
	if (!matchQuery) return matchQuery;
	const { open, topScorer, bottomScorer, ...match } = matchQuery.toObject();
	(match as unknown as MatchData).blue1 = (
		await StandForm.aggregate([
			{ $match: { teamNumber: match.blue1, matchNumber: match.matchNumber } },
			...withNameAggregation,
		])
	)[0];
	(match as unknown as MatchData).blue2 = (
		await StandForm.aggregate([
			{ $match: { teamNumber: match.blue2, matchNumber: match.matchNumber } },
			...withNameAggregation,
		])
	)[0];
	(match as unknown as MatchData).blue3 = (
		await StandForm.aggregate([
			{ $match: { teamNumber: match.blue3, matchNumber: match.matchNumber } },
			...withNameAggregation,
		])
	)[0];
	(match as unknown as MatchData).red1 = (
		await StandForm.aggregate([
			{ $match: { teamNumber: match.red1, matchNumber: match.matchNumber } },
			...withNameAggregation,
		])
	)[0];
	(match as unknown as MatchData).red2 = (
		await StandForm.aggregate([
			{ $match: { teamNumber: match.red2, matchNumber: match.matchNumber } },
			...withNameAggregation,
		])
	)[0];
	(match as unknown as MatchData).red3 = (
		await StandForm.aggregate([
			{ $match: { teamNumber: match.red3, matchNumber: match.matchNumber } },
			...withNameAggregation,
		])
	)[0];
	return match as unknown as MatchData;
};

export interface MatchData
	extends Omit<
		MatchI,
		| 'blue1'
		| 'blue2'
		| 'blue3'
		| 'red1'
		| 'red2'
		| 'red3'
		| 'open'
		| 'topScorer'
		| 'bottomScorer'
	> {
	blue1?: StandFormWithName;
	blue2?: StandFormWithName;
	blue3?: StandFormWithName;
	red1?: StandFormWithName;
	red2?: StandFormWithName;
	red3?: StandFormWithName;
}
