/* eslint-disable @typescript-eslint/no-var-requires */
import { SlashCommandBuilder } from '@discordjs/builders';
import { Awaitable, CommandInteraction } from 'discord.js';

export interface CreateCommand {
	command: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Awaitable<void>;
}

export const createCommand = ({ command, execute }: CreateCommand) => ({
	command,
	execute,
});

export const executeCommand = async (interaction: CommandInteraction) => {
	try {
		const {
			default: { execute },
		}: { default: CreateCommand } = require(`./commands/${interaction.commandName}.ts`);
		try {
			await execute(interaction);
		} catch (e) {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	} catch (e) {
		console.error(`Could not find command file of name: ${interaction.commandName}`);
	}
};
