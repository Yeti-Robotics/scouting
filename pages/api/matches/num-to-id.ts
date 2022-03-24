import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import connectDB from '@/middleware/connect-db';
import Match from '@/models/Match';

export default new RouteHandler<'api', WAuth>().use(connectDB).get(async (req, res) => {
	const matchId = await Match.findOne({ matchNumber: req.query.number }).select('_id');

	if (!matchId)
		return res.status(404).json({ message: `No match with this number ${req.query.number}` });

	return res.status(200).json(matchId._id);
});
