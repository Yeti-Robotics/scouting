/* eslint-disable @typescript-eslint/no-var-requires */
import { EventHandler } from 'create-event-handler';
import { Client, ClientEvents, Intents } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
config({ path: '.env' });
config({ path: '.env.local' });

(async () => {
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

	client.login(process.env.TOKEN || 'not here lmao xD');
})();
