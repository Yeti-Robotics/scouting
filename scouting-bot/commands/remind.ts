import constants from '../constants';
import { Client, MessageEmbed, TextChannel } from 'discord.js';
import ScheduleBlock, { ScheduleBlockI } from '../../models/ScheduleBlock';

export const remind = async (client: Client) => {
	// Get MongoDB Stuff
	const blocks = await ScheduleBlock.find()
		.sort('startTime')
		.populate('blue1 blue2 blue3 red1 red2 red3');
	const nextBlock = blocks.filter((block) => block.startTime > Date.now())[0] as ScheduleBlockI;

	const { blue1, blue2, blue3, red1, red2, red3, startTime, endTime } = nextBlock;

	// Get Text Channel to send messages too
	const channel = (await client.channels.fetch('954378244591853650')) as TextChannel;
	if (!channel) return;
	if (!channel.isText()) return;

	// Transfer User ID's into an Array of GuildMembers
	const members = [];
	members.push(await channel.guild.members.fetch(blue1.discordId || 'Some error happened...'));
	members.push(await channel.guild.members.fetch(blue2.discordId || 'Some error happened...'));
	members.push(await channel.guild.members.fetch(blue3.discordId || 'Some error happened...'));
	members.push(await channel.guild.members.fetch(red1.discordId || 'Some error happened...'));
	members.push(await channel.guild.members.fetch(red2.discordId || 'Some error happened...'));
	members.push(await channel.guild.members.fetch(red3.discordId || 'Some error happened...'));

	// Calculate Time Before your scouting session
	const warnTime = Math.floor((startTime - Date.now()) / 60000);

	// Create Embed to send to channel
	const remindEmbed = new MessageEmbed()
		.setColor(constants.yetiBlue)
		.setTitle('Scouting Reminder 😳')
		.setURL('https://scouting.yetirobotics.org/stand-scouting')
		.setDescription(
			`${new Date(startTime).toLocaleTimeString()}** to **${new Date(
				endTime,
			).toLocaleTimeString()}**, which is in ***${warnTime} minutes***`,
		)
		.addFields(
			...members
				.filter((member) => member)
				.map((member, i) => ({
					name: `${member.nickname || member.user.username}`,
					value: `You are scouting ${i < 3 ? `Blue ${i + 1}` : `Red ${i - 2}`}`,
				})),
		)
		.setFooter({
			text: 'Thank you, your help is greatly appricated 😄' + '  Made by Isaiah and Robbie',
		});

	// Return the Message pinging people and sending the Embe
	return channel.send({
		content: `<@${blue1.discordId}><@${blue2.discordId}><@${blue3.discordId}><@${red1.discordId}><@${red2.discordId}><@${red3.discordId}>`,
		embeds: [remindEmbed],
	});
};
