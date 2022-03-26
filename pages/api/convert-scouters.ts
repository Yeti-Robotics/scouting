import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import StandForm, { CreateStandForm } from '@/models/StandForm';
import User from '@/models/User';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || !req.user.administrator || req.user.banned)
			return res.status(403).json({ message: 'You are not authorized.' });

		const forms = await StandForm.find({});

		const saves = forms.map(async (form) => {
			const scouterUser = await User.findOne({ username: form.scouter });
			if (!scouterUser) return Promise.resolve();
			(form as unknown as CreateStandForm).scouter = scouterUser._id;
			return form.save();
		});

		await Promise.all(saves);
		return res.status(200).json({ message: 'Updated!' });
	});
