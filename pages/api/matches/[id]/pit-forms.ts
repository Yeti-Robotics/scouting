import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import { MatchWPit, matchWPit } from '@/models/aggregations/matchWPit';
import Match from '@/models/Match';
import mongoose from 'mongoose';

export default new RouteHandler<'api'>().use(connectDB).get(async (req, res) => {
	const match: MatchWPit | null =
		(
			await Match.aggregate([
				...matchWPit,
				{ $match: { _id: new mongoose.Types.ObjectId(String(req.query.id)) } },
			])
		)[0] ?? null;

	return res.status(200).json(match);
});
