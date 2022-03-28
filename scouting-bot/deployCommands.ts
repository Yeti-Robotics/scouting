/* eslint-disable @typescript-eslint/no-var-requires */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import { CreateCommand } from './createCommand';

export const deployCommands = async () => {
	const GUILD_ID = process.env.GUILD_ID || 'I forgor 💀';
	const CLIENT_ID = process.env.GUILD_ID || 'I forgor 💀';

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
