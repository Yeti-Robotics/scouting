import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
	res.setHeader('set-cookie', 'access_token=');
	return res.status(200).json({ message: 'Logged out.' });
};

export default handler;
