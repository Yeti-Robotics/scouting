import { Awaitable, ClientEvents } from 'discord.js';

export interface EventHandler<K extends keyof ClientEvents> {
	name: K;
	once?: boolean;
	execute(...args: ClientEvents[K]): Awaitable<void>;
}

export const createEventHandler = <K extends keyof ClientEvents>(
	key: K,
	execute: (...args: ClientEvents[K]) => Awaitable<void>,
	once?: boolean,
): EventHandler<K> => ({
	name: key,
	once,
	execute,
});
