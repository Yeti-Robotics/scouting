import { createEventHandler } from '../createEventHandler';

const ready = createEventHandler('ready', () => console.log('Ready!'), true);

export default ready;
