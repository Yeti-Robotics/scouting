import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { POPULATE_SCOUTERS } from '../../models/ScheduleBlock';
import constants from '../constants';
import { createCommand } from '../createCommand';
import { useModels } from '../utils/model';

export default createCommand({
	command: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Show all scouting blocks.'),
	execute: async (interaction) => {
		const { ScheduleBlock } = useModels();
		if (!ScheduleBlock)
			return await interaction.reply({
				content: 'There was an error executing the command.',
				ephemeral: true,
			});
		await interaction.channel?.sendTyping();

		const blocks = await ScheduleBlock.find({}).populate(POPULATE_SCOUTERS);

		if (blocks.length <= 0)
			return await interaction.reply({
				content: 'There are no blocks in the database.',
				ephemeral: true,
			});

		return await interaction.reply({
			content:
				'✨Scouting Blocks✨\n\n' +
				blocks
					.map(
						(block) =>
							`${new Date(block.startTime).toLocaleTimeString(undefined, {
								hour: '2-digit',
								minute: '2-digit',
							})} - ${new Date(block.endTime).toLocaleTimeString(undefined, {
								hour: '2-digit',
								minute: '2-digit',
							})}`,
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
