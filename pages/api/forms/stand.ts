import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import StandForm, { StandFormI } from '@/models/StandForm';

const handler = new RouteHandler();

handler
	.use(connectDB)
	.get(async (req, res) => {
		const filter: Partial<StandFormI> = JSON.parse(String(req.query.filter));
		const sort = JSON.parse(String(req.query.sort));
		// if no sort just sort by most recent
		if (!Object.keys(sort)[0]) sort.createdAt = -1;
		const forms = await StandForm.aggregate<StandFormI>([{ $match: filter }, { $sort: sort }]);
		return res.status(200).json(forms);
	})
	.post(async (req, res) => {
		const form: StandFormI = JSON.parse(req.body);

		const savedForm = new StandForm(form);
		await savedForm.save();

		return res.status(200).json({ message: 'Form saved!' });
	});

export default handler;
