import { middleware } from '@/middleware/middleware';
import User, { UserI } from '@/models/User';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { NextApiHandler } from 'next';

// should receive username and password
const handler: NextApiHandler = async (req, res) => {
	try {
		const user = JSON.parse(req.body) as UserI;
		const existingUser = await User.findOne({ username: user.username });

		if (existingUser && compareSync(user.password, existingUser.password)) {
			const jwtSecret = process.env.JWT_SECRET;
			if (!jwtSecret) return res.status(500).json({ message: 'Internal server error.' });

			const token = sign({ username: existingUser.username }, jwtSecret, {
				expiresIn: '12h',
			});
			res.setHeader(
				'set-cookie',
				`access_token=${token}; HttpOnly; Secure; Path=/; Expires=${Date.now() + 43200000}`, // expires in 12 hours from browser
			);
			return res.status(200).json({ message: 'Logged in!' });
		} else {
			return res.status(401).json({ message: 'Incorrect username or password.' });
		}
	} catch (err: unknown) {
		console.error(err);
	}
};

export default middleware(handler);
