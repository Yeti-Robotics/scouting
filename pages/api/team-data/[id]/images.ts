import PitImage from '@/models/PitImage';
import { RouteHandler } from '@/lib/RouteHandler';
import connectDB from '@/middleware/connect-db';

const handler = new RouteHandler();
handler.use(connectDB);

handler.get = async (req, res) => {
	const filter = String(req.query.id);

	const pitImages = await PitImage.find({ teamNumber: parseInt(filter) });
	return res.status(200).json(pitImages);
};

export default handler;
