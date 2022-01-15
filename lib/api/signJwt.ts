import { sign } from 'jsonwebtoken';
import { NextApiResponse } from 'next';

export const signJwt = (res: NextApiResponse, username: string) => {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) return res.status(500).json({ message: 'Internal server error.' });

	const token = sign({ username: username }, jwtSecret, {
		expiresIn: '12h',
	});

	return token;
};
