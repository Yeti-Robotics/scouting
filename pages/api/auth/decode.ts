import { RouteHandler } from '@/lib/api/RouteHandler';
import { ReqWUser } from '@/lib/api/types';
import connectDB from '@/middleware/connect-db';
import { auth } from '@/middleware/auth';

const handler = new RouteHandler<ReqWUser>();
handler.use(connectDB).use(auth);

handler.get = async (req, res) => {
	return res.status(200).json(req.user);
};

export default handler;
