import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import Match from '@/models/Match';

export default new RouteHandler<'api'>().use(connectDB).get(async (req, res) => {
	const matches = await Match.find().or([
		{ blue1: parseInt(String(req.query.id)) },
		{ blue2: parseInt(String(req.query.id)) },
		{ blue3: parseInt(String(req.query.id)) },
		{ red1: parseInt(String(req.query.id)) },
		{ red2: parseInt(String(req.query.id)) },
		{ red3: parseInt(String(req.query.id)) },
	]);

	return res.status(200).json(matches);
});
