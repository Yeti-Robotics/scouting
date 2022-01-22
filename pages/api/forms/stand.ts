import { RouteHandler } from '@/lib/RouteHandler';
import connectDB from '@/middleware/connect-db';
import StandForm, { StandFormI } from '@/models/StandForm';

const handler = new RouteHandler();
handler.use(connectDB);

handler.post = async (req, res) => {
	const form: StandFormI = JSON.parse(req.body);

	const savedForm = new StandForm(form);
	await savedForm.save();

	return res.status(200).json({ message: 'Form saved!' });
};

export default handler;
