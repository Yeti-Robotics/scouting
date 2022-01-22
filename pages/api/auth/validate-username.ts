import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import User from '@/models/User';

// Body should just be a string with the username
const handler = new RouteHandler();

handler.use(connectDB).post(async (req, res) => {
	const username: string = req.body;
	if (await User.exists({ username }))
		return res.status(400).json({ message: 'Username is already in use.' });

	return res.status(200).json({ message: 'Good username!' });
});

export default handler;
