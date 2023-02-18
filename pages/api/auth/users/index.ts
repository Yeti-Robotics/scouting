import { paginate } from '@/lib/api/paginate';
import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import User, { UserI } from '@/models/User';
import { hashSync } from 'bcrypt';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || !req.user.administrator || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update users.' });
		const normal = Boolean(req.query.normal);
		const forms = normal ? await User.find({}) : await paginate(User, req.query);
		return res.status(200).json(forms);
	})
	.patch(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update users.' });
		const { newPassword, ...user }: Omit<UserI, 'password'> & { newPassword: string } =
			JSON.parse(req.body);

		if (newPassword) {
			const hashedPass = hashSync(newPassword, 11);
			await User.updateOne({ _id: user._id }, { ...user, password: hashedPass });
		} else {
			await User.updateOne(
				{ _id: user._id },
				{ ...user, bannedBy: user.banned ? req.user.username : null },
			);
		}

		return res.status(200).json({ message: 'User successfully updated.' });
	});
