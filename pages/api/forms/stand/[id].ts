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
		if (!req.user.administrator || !req.user)
			return res.status(401).json({ message: 'You are not authorized to update users.' });
		const id = String(req.query.id);
		StandForm.findByIdAndDelete(id);
		return res.status(200).json({ message: 'Successfully deleted.' });
	});
