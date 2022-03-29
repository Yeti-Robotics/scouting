import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { POPULATE_SCOUTERS } from '../../models/ScheduleBlock';
import constants from '../constants';
import { createCommand } from '../createCommand';
import { userScouting } from '../utils/blockUtils';
import { useModels } from '../utils/model';

export default createCommand({
	command: new SlashCommandBuilder()
		.setName('user-schedule')
		.setDescription("Show a user's scheduled scouting times, if there are any.")
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription("User who's schedule you want to view.")
				.setRequired(true),
		)
		.addBooleanOption((option) => option.setName('past').setDescription('Show past blocks.')),
	execute: async (interaction) => {
		const { User, ScheduleBlock } = useModels();
		if (!User || !ScheduleBlock)
			return await interaction.reply({
				content: 'There was an error executing the command.',
				ephemeral: true,
			});
		await interaction.channel?.sendTyping();

		const targetUser = interaction.options.getUser('user', true);
		const user = await User.findOne({ discordId: targetUser.id });
		if (!user)
			return await interaction.reply({
				content: 'There are no users with your Discord id in our database.',
				ephemeral: true,
			});

		let blocks = await ScheduleBlock.find({
			$or: [
				{ blue1: user._id },
				{ blue2: user._id },
				{ blue3: user._id },
				{ red1: user._id },
				{ red2: user._id },
				{ red3: user._id },
			],
		}).populate(POPULATE_SCOUTERS);

		if (!interaction.options.getBoolean('past')) {
			const now = Date.now();
			blocks = blocks.filter((block) => block.startTime > now);
		}

		if (blocks.length <= 0)
			return await interaction.reply({
				content: 'You are not scheduled to scout any blocks in the database.',
				ephemeral: true,
			});

		return await interaction.reply({
			content:
				`✨${user.firstName} ${user.lastName}'s Schedule✨\n\n` +
				blocks
					.map(
						(block) =>
							`${new Date(block.startTime).toLocaleTimeString(undefined, {
								hour: '2-digit',
								minute: '2-digit',
							})} - ${new Date(block.endTime).toLocaleTimeString(undefined, {
								hour: '2-digit',
								minute: '2-digit',
							})}: ${userScouting(user, block) || "You're not Scouting 💀"}`,
					)
					.join('\n'),
			embeds: [
				new MessageEmbed()
					.setColor(constants.yetiBlue)
					.setTitle('Scouting Schedule')
					.setURL('https://scouting.yetirobotics.org/scouting-schedule')
					.setDescription('For more information visit the website.')
					.setFooter({
						text:
							'Thank you, your help is greatly appreciated 😄' +
							'  Made by Isaiah and Robbie',
					}),
			],
			ephemeral: true,
		});
	},
});
