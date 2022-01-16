import type { NextApiHandler } from 'next';
import StandForm from '@/models/StandForm';
import { middleware } from '@/middleware/middleware';
import { teamDataAggregation } from '@/models/aggregations/teamData';
import { mostCommonEndPos } from '@/lib/mode';

const handler: NextApiHandler = async (req, res) => {
	try {
		const filter = req.query.id;

		const team = await StandForm.aggregate([
			...teamDataAggregation,
			{ $match: { teamNumber: parseInt(filter.toString()) } },
		]);
		team.forEach((team) => {
			const commonEndPos = mostCommonEndPos(team.endPosition);
			(team as any).endPosition = commonEndPos;
		});
		const standForms = await StandForm.find({ teamNumber: parseInt(filter.toString()) });
		return res.status(200).json({ team: team[0], standForms });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export default middleware(handler);
