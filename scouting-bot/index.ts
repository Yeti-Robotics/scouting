/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, ClientEvents, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { EventHandler } from './createEventHandler';
import { model } from './utils/model';
import { isDev } from './utils/isDev';
import { executeCommand } from './createCommand';
import { deployCommands } from './deployCommands';
config({ path: '.env' });
config({ path: '.env.local', override: true });
!isDev() && config({ path: '.env.production', override: true });

(async () => {
	if (!process.env.TOKEN) throw new Error('No TOKEN variable in environment.');
	const uri = process.env.DB_URI;
	if (!uri) {
		console.log('No URI, could not connect to DB.');
		return;
	}

	//use a new connection
	await mongoose.connect(uri, { dbName: process.env.DEFAULT_DB }).then(() => {
		console.log('DB connected!');
		model();
	});

	// CREATE THE BOT
	await deployCommands()
		.catch(console.log)
		.then(() => console.log('Successfully registered application commands.'));
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
		],
	});

	// handle interactions
	client.on('interactionCreate', async (interaction) => {
		if (interaction.isCommand()) {
			await executeCommand(interaction);
		}
	});

	// registering event listeners
	const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.ts'));
	for (const file of eventFiles) {
		const {
			default: event,
		}: { default: EventHandler<keyof ClientEvents> } = require(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	// getting actions (functions to be executed on an interval)
	const actionFiles = fs.readdirSync('./actions').filter((file) => file.endsWith('.ts'));
	const actions: ((client: Client) => Promise<any>)[] = [];
	for (const file of actionFiles) {
		const {
			default: action,
		}: { default: (client: Client) => Promise<any> } = require(`./actions/${file}`);
		actions.push(action);
	}

	// Login to discord bot and start the sending reminder interval.
	client.login(process.env.TOKEN || 'not here lmao xD').then(() =>
		setInterval(async () => {
			const actionPromises = actions.map((action) => action(client));

			await Promise.all(actionPromises);
		}, 5000),
	);
})();
