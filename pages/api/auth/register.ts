import { signJwt } from '@/lib/api/signJwt';
import { middleware } from '@/middleware/middleware';
import StandForm from '@/models/StandForm';
import User, { UserI } from '@/models/User';
import { hashSync } from 'bcrypt';
import { NextApiHandler } from 'next';

// body should contain a full user minus administrator
const handler: NextApiHandler = async (req, res) => {
	try {
		const user: UserI = JSON.parse(req.body);

		if (await User.exists({ username: user.username }))
			return res.status(400).json({ message: 'Username is already in use.' });

		const hashedPass = hashSync(user.password, 11);
		user.password = hashedPass;
		user.administrator = false;

		const savedUser = new User(user);
		await savedUser.save();

		const token = signJwt(res, savedUser.username);
		if (typeof token !== 'string') {
			console.log('no JWT_SECRET in environment variables.');
			return;
		}

		return res
			.setHeader(
				'set-cookie',
				`access_token=${token}; HttpOnly; Secure; Path=/; Expires=${Date.now() + 43200000}`, // expires in 12 hours from browser
			)
			.status(200)
			.json({ message: 'Account created!' });
	} catch (err: unknown) {
		console.error(err);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export default middleware(handler);
