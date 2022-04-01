import constants from '../constants';
import { MessageEmbed } from 'discord.js';
import { ping } from '../utils/ping';
import { ScheduleBlockI } from '../../models/ScheduleBlock';

export const blockTemplate = async (block: ScheduleBlockI) => {
	const { blue1, blue2, blue3, red1, red2, red3, startTime, endTime } = block;

	// Transfer User ID's into an Array of GuildMembers
	const users: (string | undefined)[] = [];
	users.push(blue1 ? `${blue1.firstName} ${blue1.lastName}` : undefined);
	users.push(blue2 ? `${blue2.firstName} ${blue2.lastName}` : undefined);
	users.push(blue3 ? `${blue3.firstName} ${blue3.lastName}` : undefined);
	users.push(red1 ? `${red1.firstName} ${red1.lastName}` : undefined);
	users.push(red2 ? `${red2.firstName} ${red2.lastName}` : undefined);
	users.push(red3 ? `${red3.firstName} ${red3.lastName}` : undefined);

	// Calculate Time Before your scouting session
	const warnTime = Math.ceil((startTime - Date.now()) / 60000);

	// Create Embed to send to channel
	const remindEmbed = new MessageEmbed()
		.setColor(constants.yetiBlue)
		.setTitle('Scouting Reminder 😳')
		.setURL('https://scouting.yetirobotics.org/stand-scouting')
		.setDescription(
			`**${new Date(startTime).toLocaleTimeString(undefined, {
				hour: '2-digit',
				minute: '2-digit',
			})}** to **${new Date(endTime).toLocaleTimeString(undefined, {
				hour: '2-digit',
				minute: '2-digit',
			})}**${
				warnTime > 0
					? `, which is in ***${warnTime} minutes***`
					: `, which has already passed.`
			}`,
		)
		.addFields(
			...users.map((user, i) =>
				user
					? {
							name: user,
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
		pings: `${ping(blue1?.discordId)} ${ping(blue2?.discordId)} ${ping(
			blue3?.discordId,
		)} ${ping(red1?.discordId)} ${ping(red2?.discordId)} ${ping(red3?.discordId)}`,
		embed: remindEmbed,
	};
};
