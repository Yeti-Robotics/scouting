import { middleware } from '@/middleware/middleware';
import PitForm, { PitFormI } from '@/models/PitForm';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
	try {
		const form: PitFormI = JSON.parse(req.body);

		const savedForm = new PitForm(form);
		await savedForm.save();

		return res.status(200).json({ message: 'Form saved!' });
	} catch (err: unknown) {
		console.error(err);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export default middleware(handler);
