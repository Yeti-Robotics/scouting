import { RouteHandler } from '@/lib/RouteHandler';
import connectDB from '@/middleware/connect-db';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';

const handler = new RouteHandler();
handler.use(connectDB);

handler.get = async (req, res) => {
	const accessToken = req.cookies['access_token'];
	if (!accessToken) return res.status(403).json({ message: 'You are not authorized.' });

	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) return res.status(500).json({ message: 'Internal server error.' });

	let userToken;
	try {
		userToken = verify(accessToken, jwtSecret);
	} catch (err: unknown) {
		return res.status(403).json({ message: 'You are unauthorized.' });
	}

	if (typeof userToken === 'string' || !userToken)
		return res.status(403).json({ message: 'You are not authorized.' });

	const user = await User.findOne({ username: userToken.username });
	if (!user) return res.status(500).json({ message: 'Internal server error.' });

	return res.status(200).json(user);
};

export default handler;
