import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import Match from '@/models/Match';

export default new RouteHandler().use(connectDB).get(async (req, res) => {
	const matches = await Match.find();
	return res
		.status(200)
		.json(Object.fromEntries(matches.map((match) => [match.matchNumber, true])));
});
