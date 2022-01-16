import { mostCommonEndPos } from '@/lib/mode';
import { middleware } from '@/middleware/middleware';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
	try {
		const teams: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);
		teams.forEach((team) => {
			const commonEndPos = mostCommonEndPos(team.endPosition);
			(team as any).endPosition = commonEndPos;
		});
		return res.json(teams);
	} catch (err: unknown) {
		console.error(err);
	}
};

export default middleware(handler);
