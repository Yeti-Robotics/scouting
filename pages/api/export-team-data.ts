import { RouteHandler } from '@/lib/api/RouteHandler';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';
import connectDB from '../../middleware/connect-db';

export default new RouteHandler().use(connectDB).get(async (req, res) => {
	const teams: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);
	return res.json(teams);
});
