import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import StandForm from '@/models/StandForm';

const handler = new RouteHandler<'api', WAuth>();

export default handler
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		const id = String(req.query.id);
		const form = await StandForm.findById(id);
		return res.status(200).json(form);
	})
	.delete(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res
				.status(401)
				.json({ message: 'You are not authorized to delete stand forms.' });
		const id = String(req.query.id);
		await StandForm.findByIdAndDelete(id);
		return res.status(200).json({ message: 'Successfully deleted.' });
	});
