import { middleware } from '@/middleware/middleware';
import User, { UserI } from '@/models/User';
import { NextApiHandler } from 'next';

// body should contain a full user minus administrator
const handler: NextApiHandler = async (req, res) => {
	try {
		const user: Omit<UserI, 'administrator'> = JSON.parse(req.body);

		if (await User.exists({ username: user.username }))
			return res.status(400).json({ message: 'Username is already in use.' });
	} catch (err: unknown) {
		console.error(err);
	}
};

export default middleware(handler);
