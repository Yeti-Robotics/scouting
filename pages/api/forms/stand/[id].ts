import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import StandForm from '@/models/StandForm';

const handler = new RouteHandler();

export default handler.use(connectDB).get(async (req, res) => {
	const id = String(req.query.id);
	const form = await StandForm.findById(id);
	return res.status(200).json(form);
});
