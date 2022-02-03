import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import PitForm from '@/models/PitForm';
import PitImage from '@/models/PitImage';

export default new RouteHandler().use(connectDB).get(async (req, res) => {
	const id = String(req.query.id);
	const form = await PitForm.findById(id);
	const images = await PitImage.find({ formId: id });
	return res.status(200).json({ form, images });
});
