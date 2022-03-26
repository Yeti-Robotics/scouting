import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export const deployCommands = async () => {
	const GUILD_ID = '867919239783264346';
	const CLIENT_ID = '840990803526549564';

	const commands = [
		new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	].map((command) => command.toJSON());

	const rest = new REST({ version: '9' }).setToken(process.env.TOKEN || 'No here xD');

	return rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
};
