import { SlashCommandBuilder } from '@discordjs/builders';
import { createCommand } from '../createCommand';

export default createCommand({
	command: new SlashCommandBuilder().setName('ping').setDescription('Replies with "Pong!"'),
	execute: (interaction) => interaction.reply('Pong!'),
});
