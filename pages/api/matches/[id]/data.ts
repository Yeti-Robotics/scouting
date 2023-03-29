import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import { getMatchData } from '@/models/aggregations/matchData';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		const id = String(req.query.id);

		const matchData = await getMatchData(id);

		return res.status(200).json(matchData);
	});
