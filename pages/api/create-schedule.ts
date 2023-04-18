import { Document } from 'mongoose';
import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import ScheduleBlock, { CreateScheduleBlock } from '@/models/ScheduleBlock';
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
	const start = opts.startMatch;
	const end = opts.lastMatch;
	const blockLength = opts.blockLength; // num matches they scout in a row

	const blocks: (Document<unknown, any, any> &
		CreateScheduleBlock & {
			_id: string;
		})[] = [];

	for (let i = start; i < end; i += blockLength) {
		let block;
		if (i + (blockLength - 1) < end)
			block = new ScheduleBlock({
				startMatch: i,
				lastMatch: (i + (blockLength - 1)) % end,
			});
		else {
			block = new ScheduleBlock({
				startMatch: i,
				lastMatch: end,
			});
		}
		console.log({ start: block.startMatch, end: block.lastMatch });
		blocks.push(block as any);
	}

	return blocks;
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
		if (JSON.parse(String(req.query.auto))) {
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

			const saves = slots.map((block) => {
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
		} else {
			const slotSaves = slots.map((slot) => slot.save());
			await Promise.all(slotSaves);
			return res.status(200).json({ message: 'Schedule created!' });
		}
	});
