import { RouteHandler } from '@/lib/api/RouteHandler';
import { endPosToString, mostCommonEndPos } from '@/lib/mode';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';

export default new RouteHandler().get(async (req, res) => {
	const teams: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);
	teams.forEach((team) => {
		const commonEndPos = mostCommonEndPos(team.endPosition);
		(team as any).endPosition = commonEndPos;
		(team as any).bestEndPosition = endPosToString(
			Math.max(...(team.endPosition.length > 0 ? team.endPosition : [0])),
		);
	});
	return res.json(teams);
});
