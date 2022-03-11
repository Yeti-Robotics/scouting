import PitImage from '@/models/PitImage';
import { NextConfig } from 'next';
import fs from 'fs';
import { RouteHandler } from '@/lib/api/RouteHandler';
import connectDB from '@/middleware/connect-db';
import formidable from 'formidable';

export const config: NextConfig = {
	api: {
		bodyParser: false,
	},
};

const handler = new RouteHandler();

handler.use(connectDB).post(async (req, res) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		if (!req.query.formId || !req.query.teamNumber)
			return res.status(400).json({ message: 'No form id recieved for image.' });
		const images = formidable({ multiples: true, keepExtensions: true });

		images.on('file', (name, file) => {
			const data = fs.readFileSync(file.filepath);
			const image = new PitImage({
				data,
				formId: req.query.formId,
				teamNumber: parseInt(String(req.query.teamNumber)),
			});
			image.save();
		});
		images.on('aborted', () => {
			reject(res.status(500).send('Aborted'));
		});
		images.on('end', () => {
			resolve(res.status(200).send('done'));
		});

		images.parse(req, () => {});
	});
});

export default handler;
