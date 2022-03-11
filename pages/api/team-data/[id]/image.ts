import PitImage from '@/models/PitImage';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';

const handler = new RouteHandler();

handler.use(connectDB).get(async (req, res) => {
	const filter = String(req.query.imageId); // image document id

	const pitImages = await PitImage.findById(filter);

	return res.status(200).json(pitImages);
});

export default handler;
