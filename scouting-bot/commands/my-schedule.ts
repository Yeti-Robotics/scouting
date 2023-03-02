import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { POPULATE_SCOUTERS } from '../../models/ScheduleBlock';
import constants from '../constants';
import { createCommand } from '../createCommand';
import { userScouting } from '../utils/blockUtils';
import { useModels } from '../utils/model';

export default createCommand({
	command: new SlashCommandBuilder()
		.setName('my-schedule')
		.setDescription('Show your scheduled scouting times, if there are any.')
		.addBooleanOption((option) => option.setName('past').setDescription('Show past blocks.')),
	execute: async (interaction) => {
		const { User, ScheduleBlock } = useModels();
		if (!User || !ScheduleBlock) {
			await interaction.reply({
				content: 'There was an error executing the command.',
				ephemeral: true,
			});
			return;
		}
		if (!interaction.channel || interaction.channel.isVoiceBased()) return;
		await interaction.channel.sendTyping();
		const user = await User.findOne({ discordId: interaction.user.id });
		if (!user) {
			await interaction.reply({
				content: 'There are no users with your Discord id in our database.',
				ephemeral: true,
			});
			return;
		}

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

		if (!interaction.options.get('past')?.value) {
			const now = Date.now();
			blocks = blocks.filter((block) => block.startTime > now);
		}

		if (blocks.length <= 0) {
			await interaction.reply({
				content: 'You are not scheduled to scout any blocks in the database.',
				ephemeral: true,
			});
			return;
		}

		await interaction.reply({
			content:
				'✨Your Schedule✨\n\n' +
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
				new EmbedBuilder()
					.setColor(constants.yetiBlue)
					.setTitle('Scouting Schedule')
					.setURL('https://scouting.yetirobotics.org/scouting-schedule')
					.setDescription('For more information visit the website.')
					.setFooter({
						text:
							'Thank you, your help is greatly appreciated 😄' +
							'  Made by Ibomb and Robbie',
					}),
			],
			ephemeral: true,
		});
	},
});
