import scoutExpectedContribution from '@/lib/analysis/sprCalculation';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import { sprDataAggregation } from '@/models/aggregations/sprData';
import StandForm from '@/models/StandForm';
const handler = new RouteHandler();

handler.use(connectDB).get(async (_req, res) => {
	const alliances: any[] = await StandForm.aggregate(sprDataAggregation);
	const teamScoutMap = {};
	const scoutScoreMap = {};

	alliances[0].scoutScores.forEach((scout) => {
		teamScoutMap[scout.teamScouted] = teamScoutMap[scout.teamScouted]
			? [...teamScoutMap[scout.teamScouted], scout.scoutID]
			: [scout.scoutID];
	});

	alliances[0].scoutScores.forEach((scout) => {
		scoutScoreMap[scout.scoutID] = scout.scoutscore;
	});

	console.log(scoutScoreMap);
	console.log(teamScoutMap);

	const result = scoutExpectedContribution(scoutScoreMap, teamScoutMap, 42);

	return res.json(result);
});

export default handler;
