import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import PitForm, { PitFormI } from '@/models/PitForm';

const handler = new RouteHandler();

handler.use(connectDB).post(async (req, res) => {
	const form: PitFormI = JSON.parse(req.body);

	const savedForm = new PitForm(form);
	const inserted = await savedForm.save();

	return res.status(200).json(inserted);
});

export default handler;
