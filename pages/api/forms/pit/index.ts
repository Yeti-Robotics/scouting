import { paginate } from '@/lib/api/paginate';
import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import PitForm, { PitFormI } from '@/models/PitForm';

const handler = new RouteHandler<'api', WAuth>();

export default handler
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		const forms = await paginate(PitForm, req.query);
		return res.status(200).json(forms);
	})
	.post(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized.' });
		const form: PitFormI = JSON.parse(req.body);

		const current = await PitForm.findOne({ teamNumber: form.teamNumber });
		// Delete existing form for team, if it exists
		await current?.deleteOne();

		try {
			const savedForm = new PitForm(form);
			const inserted = await savedForm.save();

			return res.status(200).json(inserted);
		} catch (e) {
			// If fail to insert the new form, save the old one back to db
			await current?.save();
			return res.status(500).json({ message: 'Failed to create :(' });
		}
	})
	.patch(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update forms.' });
		const form: PitFormI = JSON.parse(req.body);

		await PitForm.updateOne({ _id: form._id }, form);
		return res.status(200).json({ ...form, message: 'Form successfully updated.' });
	});
