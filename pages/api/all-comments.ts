import { RouteHandler } from '@/lib/api/RouteHandler';
import pemForms from '@/past-data/pem-stand-forms.json';
import ashForms from '@/past-data/ash-stand-forms.json';

export default new RouteHandler().get(async (req, res) => {
	return res
		.status(200)
		.json(
			ashForms
				.concat(pemForms)
				.filter((form) =>
					req.query.teamNumber
						? form.teamNumber.toString() === req.query.teamNumber
						: true,
				),
		);
});
