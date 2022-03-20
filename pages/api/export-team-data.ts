import { RouteHandler } from '@/lib/api/RouteHandler';
import { mostCommonEndPos } from '@/lib/mode';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';

export default new RouteHandler().get(async (req, res) => {
	const teams: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);
	teams.forEach((team) => {
		const commonEndPos = mostCommonEndPos(team.endPosition);
		(team as any).endPosition = commonEndPos;
	});
	return res.json(teams);
});
