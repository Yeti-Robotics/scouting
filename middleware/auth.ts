import { RouteHandlerMiddleware } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { cookieParser } from '@/lib/cookieParser';
import User, { UserI } from '@/models/User';
import { verify } from 'jsonwebtoken';

export const AUTH_MIDDLEWARE_KEY = 'auth';

export const authToken = async (accessToken: string | undefined): Promise<UserI | undefined> => {
	if (!accessToken) return;

	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) return;

	let userToken;
	try {
		userToken = verify(accessToken, jwtSecret);
	} catch (err: unknown) {
		return;
	}

	if (typeof userToken === 'string' || !userToken) return;

	const user = await User.findOne({ username: userToken.username });
	if (!user) return;

	return user;
};

export const auth: RouteHandlerMiddleware<'api', WAuth> = {
	key: AUTH_MIDDLEWARE_KEY,
	ssr: true,
	middleware: async (req, res, end) => {
		const cookies = cookieParser(req.headers.cookie);
		const accessToken = cookies['access_token'];
		const user = await authToken(accessToken);
		if (user) req.user = user;
	},
};
