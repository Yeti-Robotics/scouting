import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import StandForm from '@/models/StandForm';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || !req.user.administrator || req.user.banned)
			return res.status(403).json({ message: 'You are not approved.' });
		const forms = await StandForm.find({});

		const saves = forms.map((form) => {
			form.approved = true;
			return form.save();
		});

		await Promise.all(saves);
		return res.status(200).json({ message: 'All forms approved.' });
	});
