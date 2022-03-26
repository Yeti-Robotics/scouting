import { mostCommonEndPos } from '@/lib/mode';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';
const handler = new RouteHandler();

handler.use(connectDB).get(async (_req, res) => {
	const teams: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);
	teams.forEach((team) => {
		const commonEndPos = mostCommonEndPos(team.endPosition);
		const ogEndPos = [...team.endPosition];
		(team as any).endPosition = commonEndPos;
		(team as any).bestEndPosition = Math.max(...(ogEndPos.length > 0 ? ogEndPos : [0]));
	});
	return res.json(teams);
});

export default handler;
