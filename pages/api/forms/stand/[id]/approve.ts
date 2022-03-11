import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import StandForm from '@/models/StandForm';
import User from '@/models/User';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to approve forms.' });
		const id = String(req.query.id);

		const form = await StandForm.findById(id);
		if (!form) return res.status(404).json({ message: 'Form not found.' });
		if (form.approved) return res.status(400).json({ message: 'Form already approved.' });
		await StandForm.findByIdAndUpdate(form._id, { approved: true });

		const scouter = await User.findOne({ username: form?.scouter });
		if (!scouter)
			return res.status(404).json({ message: 'Scouter not found, form still approved.' });
		await User.findByIdAndUpdate(scouter._id, { coins: scouter.coins + 25 });

		return res.status(200).json({ message: 'Form successfully approved.' });
	});
