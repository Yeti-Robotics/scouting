import { SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../createCommand';

export default createCommand({
	command: new SlashCommandBuilder().setName('ping').setDescription('Replies with "Pong!"'),
	execute: (interaction) => {
		interaction.reply({
			content: 'Pong!',
			ephemeral: true,
		});
	},
});
