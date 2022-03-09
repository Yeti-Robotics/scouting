import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match from '@/models/Match';
import User, { UserI } from '@/models/User';

const shuffle = <T>(array: T[]): T[] => {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.post(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res
				.status(403)
				.json({ message: 'You are not authorized to create the schedgy.' });
		const usersCanScout: Record<string, boolean> = JSON.parse(req.body);
		const matches = await Match.find({}).sort('matchNumber');
		const users = await User.find({}).where({ canScout: true });

		const usersSaves = users.map((user) => {
			user.canScout = usersCanScout[user._id];
			return user.save();
		});
		const userSavesAll = Promise.all(usersSaves);

		let currentUsers = [...users.sort((a, b) => a.firstName.localeCompare(b.firstName))];
		let usersIndex = 0;

		const saves = matches.map((match) => {
			let shouldShuffle = false;
			match.scouters = {};
			match.scouters.blue1 = currentUsers[usersIndex].username;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			match.scouters.blue2 = currentUsers[usersIndex].username;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			match.scouters.blue3 = currentUsers[usersIndex].username;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			match.scouters.red1 = currentUsers[usersIndex].username;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			match.scouters.red2 = currentUsers[usersIndex].username;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			match.scouters.red3 = currentUsers[usersIndex].username;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			if (shouldShuffle) currentUsers = shuffle(currentUsers);
			match.validateSync();
			return match.save();
		});

		await Promise.all(saves);
		await userSavesAll;
		return res.status(200).json({ message: 'Schedule created!' });
	});
