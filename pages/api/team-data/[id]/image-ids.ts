import PitImage from '@/models/PitImage';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
	const id = String(req.query.id);
	const images = await PitImage.find({ teamNumber: parseInt(id) }).select({ _id: 1 });
	return res.status(200).json(images);
};

export default handler;
