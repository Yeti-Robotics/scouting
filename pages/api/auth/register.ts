import { signJwt } from '@/lib/api/signJwt';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import User, { UserI } from '@/models/User';
import { hashSync } from 'bcrypt';

// body should contain a full user minus administrator
const handler = new RouteHandler();

handler.use(connectDB).post(async (req, res) => {
	const { at, user }: { at: string; user: UserI } = JSON.parse(req.body);

	if (await User.exists({ username: user.username }))
		return res.status(400).json({ message: 'Username is already in use.' });

	const hashedPass = hashSync(user.password, 11);
	user.password = hashedPass;
	user.administrator = false;

	const headers = new Headers();
	headers.append('Authorization', `Bearer ${at}`);

	// get discord user id
	const discordRes = await fetch('https://discord.com/api/users/@me', { headers });
	console.log(discordRes);
	const discUser = await discordRes.json();

	if (!discUser) return res.status(401).json({ message: 'Discord is unauthorized.' });

	// check if user is in our discord server
	const userServersRes = await fetch(`https://discord.com/api/users/@me/guilds`, { headers });
	console.log(userServersRes);
	if (!userServersRes.ok)
		return res.status(401).json({ message: 'Something went wrong checking your servers.' });
	const servers: any[] = await userServersRes.json();
	if (!servers.some((server) => server.id === '408711970305474560'))
		return res.status(401).json({ message: "You are not a part of yeti's Discord server." });

	const savedUser = new User({ ...user, teamNumber: 3506, discordId: discUser.id });
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
