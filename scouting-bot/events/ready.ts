import { createEventHandler } from '../create-event-handler';

const ready = createEventHandler('ready', () => console.log('Ready!'), true);

export default ready;
