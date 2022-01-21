import type { NextApiHandler } from 'next';
import { middleware } from '@/middleware/middleware';
import PitImage from '@/models/PitImage';

const handler: NextApiHandler = async (req, res) => {
	try {
		const filter = String(req.query.id);

		const pitImages = await PitImage.find({ teamNumber: parseInt(filter) });
		return res.status(200).json(pitImages);
	} catch (err) {
		//console.error(err);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export default middleware(handler);
