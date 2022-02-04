import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import User from '@/models/User';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user.administrator || !req.user)
			return res.status(401).json({ message: 'You are not authorized to update users.' });
		const id = String(req.query.id);
		const user = await User.findById(id);
		return res.status(200).json(user);
	});
