import { RouteHandler } from '@/lib/api/RouteHandler';
import StandForm from '@/models/StandForm';
import connectDB from '../../middleware/connect-db';

export default new RouteHandler().use(connectDB).get(async (req, res) => {
	const teams = await StandForm.find({});
	return res.status(200).json(teams);
});
