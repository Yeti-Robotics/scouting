import { RouteHandler } from '@/lib/api/RouteHandler';

const handler = new RouteHandler();

handler.get = (req, res) => res.status(200).send('pinged');

export default handler;
