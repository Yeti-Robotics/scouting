import { Client, TextChannel } from 'discord.js';
import { useModels } from '../utils/model';
import { ScheduleBlockI } from '../../models/ScheduleBlock';
import { remind } from '../templates/remind';
import { Document } from 'mongoose';
import { isDev } from '../utils/isDev';

const remindScouters = async (client: Client) => {
	const { ScheduleBlock } = useModels();
	// Constant Checker
	// Get MongoDB Stuff
	const blocks = await ScheduleBlock.find({})
		.sort('startTime')
		.populate('blue1 blue2 blue3 red1 red2 red3');
	const nextBlock = blocks.filter(
		(block) => block.startTime > Date.now(),
	)[0] as unknown as Document<ScheduleBlockI> & ScheduleBlockI & { _id: string };

	// if no next block or no scouters return
	if (
		!nextBlock ||
		(!nextBlock.blue1 &&
			!nextBlock.blue2 &&
			!nextBlock.blue3 &&
			!nextBlock.red1 &&
			!nextBlock.red2 &&
			!nextBlock.red3)
	)
		return;

	if (nextBlock.startTime - Date.now() <= 30 * 60 * 1000 && !nextBlock.min30) {
		// within 30mins and hasn't done 30 min warning
		await nextBlock.updateOne({ min30: true });
	} else if (nextBlock.startTime - Date.now() <= 10 * 60 * 1000 && !nextBlock.min10) {
		// within 10 mins and hasn't done 10 min warning
		await nextBlock.updateOne({ min10: true });
	} else {
		// has done both warnings or is not within 30 or 10 mins
		return;
	}

	// Get Text Channel to send messages too
	const channel = (await client.channels.fetch(
		isDev() ? '954378244591853650' : '721729526857465946',
	)) as TextChannel;
	if (!channel) return;
	if (!channel.isText()) return;

	const reminderMessage = await remind(client, channel, nextBlock);

	console.log('Sending reminder...');
	return channel.send(reminderMessage);
};

export default remindScouters;
