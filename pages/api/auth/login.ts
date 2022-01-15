import { signJwt } from '@/lib/api/signJwt';
import { middleware } from '@/middleware/middleware';
import User, { UserI } from '@/models/User';
import { compareSync } from 'bcrypt';
import { NextApiHandler } from 'next';

// should receive username and password
const handler: NextApiHandler = async (req, res) => {
	try {
		const user = JSON.parse(req.body) as UserI;
		const existingUser = await User.findOne({ username: user.username });

		if (existingUser && compareSync(user.password, existingUser.password)) {
			const token = signJwt(res, existingUser.username);

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
