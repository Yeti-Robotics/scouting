import { middleware } from '@/middleware/middleware';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
	try {
		const accessToken = req.cookies['access_token'];
		if (!accessToken) return res.status(403).json({ message: 'You are not authorized.' });

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) return res.status(500).json({ message: 'Internal server error.' });

		const userToken = verify(accessToken, jwtSecret);

		if (typeof userToken === 'string')
			return res.status(403).json({ message: 'You are not authorized.' });

		const user = await User.findOne({ username: userToken.username });
		if (!user) return res.status(500).json({ message: 'Internal server error.' });

		return res.status(200).json(user);
	} catch (err: unknown) {
		console.error(err);
	}
};

export default middleware(handler);
