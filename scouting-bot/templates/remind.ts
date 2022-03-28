import constants from '../constants';
import { Client, GuildMember, MessageEmbed, MessageOptions, TextChannel } from 'discord.js';
import { ping } from '../utils/ping';
import { ScheduleBlockI } from '../../models/ScheduleBlock';

const fetch = async (channel: TextChannel, id: string | undefined) => {
	try {
		const member = await channel.guild.members.fetch(id || '123456');
		return member;
	} catch (e) {
		return Promise.resolve(undefined);
	}
};

export const remind = async (
	client: Client,
	channel: TextChannel,
	block: ScheduleBlockI,
): Promise<MessageOptions> => {
	const { blue1, blue2, blue3, red1, red2, red3, startTime, endTime } = block;

	// Transfer User ID's into an Array of GuildMembers
	const members: (GuildMember | undefined)[] = [];
	members.push(await fetch(channel, blue1?.discordId));
	members.push(await fetch(channel, blue2?.discordId));
	members.push(await fetch(channel, blue3?.discordId));
	members.push(await fetch(channel, red1?.discordId));
	members.push(await fetch(channel, red2?.discordId));
	members.push(await fetch(channel, red3?.discordId));

	// Calculate Time Before your scouting session
	const warnTime = Math.floor((startTime - Date.now()) / 60000);

	// Create Embed to send to channel
	const remindEmbed = new MessageEmbed()
		.setColor(constants.yetiBlue)
		.setTitle('Scouting Reminder 😳')
		.setURL('https://scouting.yetirobotics.org/stand-scouting')
		.setDescription(
			`**${new Date(startTime).toLocaleTimeString()}** to **${new Date(
				endTime,
			).toLocaleTimeString()}**, which is in ***${warnTime} minutes***`,
		)
		.addFields(
			...members.map((member, i) =>
				member
					? {
							name: `${member.nickname || member.user.username}`,
							value: `You are scouting ${i < 3 ? `Blue ${i + 1}` : `Red ${i - 2}`}`,
					  }
					: {
							name: 'No One 😔',
							value: `Is scouting  ${i < 3 ? `Blue ${i + 1}` : `Red ${i - 2}`}`,
					  },
			),
		)
		.setFooter({
			text: 'Thank you, your help is greatly appreciated 😄' + '  Made by Isaiah and Robbie',
		});

	// Return the Message pinging people and sending the Embe
	return {
		content: `${ping(blue1?.discordId)} ${ping(blue2?.discordId)} ${ping(
			blue3?.discordId,
		)} ${ping(red1?.discordId)} ${ping(red2?.discordId)} ${ping(red3?.discordId)}`,
		embeds: [remindEmbed],
	};
};
