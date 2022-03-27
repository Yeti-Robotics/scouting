/* eslint-disable @typescript-eslint/no-var-requires */
import { EventHandler } from 'create-event-handler';
import { Client, ClientEvents, Intents } from 'discord.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { remind } from './commands/remind';
config({ path: '.env' });
config({ path: '.env.local' });

(async () => {
	// Database Grabber
	const uri = process.env.DB_URI;
	if (!uri) {
		console.log('No URI, could not connect to DB.');
		return;
	}
	if (mongoose.connections[0].readyState) {
		// use the current connection
		return;
	}
	//use a new connection
	await mongoose.connect(uri, { dbName: process.env.DEFAULT_DB });

	// CREATE THE BOT
	// await deployCommands()
	// 	.then(() => console.log('Successfully registered application commands.'))
	// 	.catch(console.error);
	const client = new Client({
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		],
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

	// Login to discord bot and start the sending reminder interval.
	client.login(process.env.TOKEN || 'not here lmao xD').then(async () => {
		// Constant Checker
		setInterval(async () => {
			await remind(client);
		}, 30000);
	});
})();
