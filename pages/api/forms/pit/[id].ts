import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import PitForm from '@/models/PitForm';
import PitImage from '@/models/PitImage';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		const id = String(req.query.id);
		const form = await PitForm.findById(id);
		const images = await PitImage.find({ formId: id });
		return res.status(200).json({ form, images });
	})
	.delete(async (req, res) => {
		if (!req.user.administrator || !req.user)
			return res.status(401).json({ message: 'You are not authorized to update users.' });
		const id = String(req.query.id);
		PitForm.findByIdAndDelete(id);
		PitImage.deleteMany({ formId: id });
		return res.status(200).json({ message: 'Successfully deleted.' });
	});
