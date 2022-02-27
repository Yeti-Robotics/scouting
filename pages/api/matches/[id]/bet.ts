import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import connectDB from '@/middleware/connect-db';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {});
