import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import ScheduleBlock from '@/models/ScheduleBlock';
import User from '@/models/User';
import { ScheduleOptionsForm } from '../scouting-schedule/create';

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

const calcSchedule = (opts: ScheduleOptionsForm) => {
	const start = new Date(opts.startTime).valueOf();
	const end = new Date(opts.endTime).valueOf();
	const lunchStart = new Date(opts.lunchStartTime).valueOf();
	const lunchEnd = new Date(opts.lunchEndTime).valueOf();
	const blockLength = parseInt(String(opts.blockLength));

	// lunch included
	const numBlocks = (end - start) / (blockLength * 60 * 1000);

	for (let i = 0; i < numBlocks; i++) {
		const block = new ScheduleBlock({});
	}
};

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.post(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res
				.status(403)
				.json({ message: 'You are not authorized to create the schedgy.' });
		const {
			users: usersCanScout,
			options,
		}: { users: Record<string, boolean>; options: ScheduleOptionsForm } = JSON.parse(req.body);
		// placeholder, need to actually calc how many blocks to have
		const slots = calcSchedule(options);
		const users = await User.find({});

		const usersSaves = users.map((user) => {
			user.canScout = usersCanScout[user._id];
			return user.save();
		});
		const userSavesAll = Promise.all(usersSaves);

		let currentUsers = [
			...users
				.filter((user) => usersCanScout[user._id])
				.sort((a, b) => a.firstName.localeCompare(b.firstName)),
		];
		let usersIndex = 0;

		const saves = slots.map(() => {
			const block = new ScheduleBlock();
			let shouldShuffle = false;
			block.blue1 = currentUsers[usersIndex]._id;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			block.blue2 = currentUsers[usersIndex]._id;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			block.blue3 = currentUsers[usersIndex]._id;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			block.red1 = currentUsers[usersIndex]._id;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			block.red2 = currentUsers[usersIndex]._id;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			block.red3 = currentUsers[usersIndex]._id;
			usersIndex++;
			if (usersIndex >= currentUsers.length) {
				shouldShuffle = true;
				usersIndex = 0;
			}

			if (shouldShuffle) currentUsers = shuffle(currentUsers);
			block.validateSync();
			return block.save();
		});

		await Promise.all(saves);
		await userSavesAll;
		return res.status(200).json({ message: 'Schedule created!' });
	});
