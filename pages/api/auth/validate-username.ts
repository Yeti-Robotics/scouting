import { middleware } from '@/middleware/middleware';
import User from '@/models/User';
import { NextApiHandler } from 'next';

// Body should just be a string with the username
const handler: NextApiHandler = async (req, res) => {
	try {
		const username: string = req.body;
		if (await User.exists({ username }))
			return res.status(400).json({ message: 'Username is already in use.' });

		return res.status(200).json({ message: 'Good username!' });
	} catch (err: unknown) {
		console.error(err);
	}
};

export default middleware(handler);
