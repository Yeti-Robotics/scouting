import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match from '@/models/Match';
import PitForm from '@/models/PitForm';
import PitImage from '@/models/PitImage';
import StandForm from '@/models/StandForm';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || !req.user.administrator || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to clean the db.' });

		const deletes: any[] = [];
		deletes.push(StandForm.deleteMany({}));
		deletes.push(PitForm.deleteMany({}));
		deletes.push(PitImage.deleteMany({}));
		deletes.push(Match.deleteMany({}));
		await Promise.all(deletes);
		return res.status(200).json({ message: 'DB successfully cleaned out.' });
	});
