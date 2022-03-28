/* eslint-disable @typescript-eslint/no-var-requires */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import { CreateCommand } from './createCommand';
import { isDev } from './utils/isDev';

export const deployCommands = async () => {
	const GUILD_ID = isDev() ? '867919239783264346' : '408711970305474560';
	const CLIENT_ID = '957359702335979590';

	const commands: any[] = [];

	const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.ts'));

	for (const file of commandFiles) {
		const {
			default: { command },
		}: { default: CreateCommand } = require(`./commands/${file}`);
		commands.push(command.toJSON());
	}

	const rest = new REST({ version: '9' }).setToken(process.env.TOKEN || 'No here xD');

	return rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
};
