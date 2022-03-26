import { RouteHandler } from '@/lib/api/RouteHandler';
import { endPosToString, mostCommonEndPos } from '@/lib/mode';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';

export default new RouteHandler().get(async (req, res) => {
	const teams: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);
	teams.forEach((team) => {
		const commonEndPos = mostCommonEndPos(team.endPosition);
		const ogEndPos = [...team.endPosition];
		(team as any).endPosition = commonEndPos;
		(team as any).bestEndPosition = endPosToString(
			Math.max(...(ogEndPos.length > 0 ? ogEndPos : [0])),
		);
	});
	return res.json(teams);
});
