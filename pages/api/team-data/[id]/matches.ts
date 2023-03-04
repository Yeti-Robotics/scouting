import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';

export default new RouteHandler<'api'>().use(connectDB).get(async (req, res) => {});
