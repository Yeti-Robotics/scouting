import { signJwt } from '@/lib/api/signJwt';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import User, { UserI } from '@/models/User';
import { compareSync } from 'bcrypt';

// should receive username and password
const handler = new RouteHandler();
handler.use(connectDB);

handler.post = async (req, res) => {
	const user = JSON.parse(req.body) as UserI;
	const existingUser = await User.findOne({ username: user.username });

	if (existingUser && compareSync(user.password, existingUser.password)) {
		const token = signJwt(res, existingUser.username);

		res.setHeader(
			'set-cookie',
			`access_token=${token}; HttpOnly; Secure; Path=/; Expires=${new Date(
				Date.now() + 43200000,
			).toUTCString()}`, // expires in 12 hours from browser
		);

		return res.status(200).json({ message: 'Logged in!' });
	} else {
		return res.status(401).json({ message: 'Incorrect username or password.' });
	}
};

export default handler;
