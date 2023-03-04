import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import StandForm from '@/models/StandForm';

export default new RouteHandler<'api'>().use(connectDB).get(async (req, res) => {
	const matches = await StandForm.find({ teamNumber: parseInt(String(req.query.id)) });

	return res.status(200).json(matches);
});
