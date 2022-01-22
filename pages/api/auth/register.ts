import { signJwt } from '@/lib/api/signJwt';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import User, { UserI } from '@/models/User';
import { hashSync } from 'bcrypt';

// body should contain a full user minus administrator
const handler = new RouteHandler();

handler.use(connectDB).post(async (req, res) => {
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
			`access_token=${token}; HttpOnly; Secure; Path=/; Expires=${new Date(
				Date.now() + 43200000,
			).toUTCString()}`, // expires in 12 hours from browser
		)
		.status(200)
		.json({ message: 'Account created!' });
});

export default handler;
