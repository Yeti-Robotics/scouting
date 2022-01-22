import { RouteHandler } from '@/lib/api/RouteHandler';

const handler = new RouteHandler();

handler.get = (req, res) => {
	res.setHeader(
		'set-cookie',
		`access_token=; Secure; HttpOnly; Path=/; Expires=${new Date().toUTCString()}`,
	);
	return res.status(200).json({ message: 'Logged out.' });
};

export default handler;
