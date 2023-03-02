import { Client, TextChannel } from 'discord.js';
import { useModels } from '../utils/model';
import { POPULATE_SCOUTERS, ScheduleBlockI } from '../../models/ScheduleBlock';
import { blockTemplate } from '../messages/block';
import { Document } from 'mongoose';

const remindScouters = async (client: Client) => {
	const { ScheduleBlock } = useModels();
	// Constant Checker
	// Get MongoDB Stuff
	const blocks = await ScheduleBlock.find().sort('startTime').populate(POPULATE_SCOUTERS);

	const possibleBlocks = blocks.filter((block) => block.startTime > Date.now());

	const nextBlock = possibleBlocks[0] as unknown as Document<ScheduleBlockI> &
		ScheduleBlockI & { _id: string };

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
		process.env.CHANNEL_ID || 'i forgor 💀',
	)) as TextChannel;
	if (!channel) return;
	if (!channel.isTextBased()) return;

	const { pings, embed } = await blockTemplate(nextBlock);

	console.log('Sending reminder...');
	return channel.send({ content: pings, embeds: [embed] });
};

export default remindScouters;
