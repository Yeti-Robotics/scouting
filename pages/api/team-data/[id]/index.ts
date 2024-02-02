import StandForm from '@/models/StandForm';
import { teamDataAggregation } from '@/models/aggregations/teamData';
import PitForm from '@/models/PitForm';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';

const handler = new RouteHandler();

handler.use(connectDB).get(async (req, res) => {
	const filter = String(req.query.id);

	const team = await StandForm.aggregate([
		...teamDataAggregation,
		{ $match: { teamNumber: parseInt(filter) } },
	]);
	const standForms = await StandForm.find({ teamNumber: parseInt(filter) }).sort({
		matchNumber: 1,
	});
	const pitForms = await PitForm.find({ teamNumber: parseInt(filter) });
	return res.status(200).json({ team: team[0], standForms, pitForms });
});

export default handler;
