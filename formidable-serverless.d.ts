import { NextApiRequest } from 'next';

declare module 'formidable-serverless' {
	declare class IncomingForm {
		constructor(private options?: { [key: string]: any });

		on(event: string, callback: (name: string, file: { path: string }) => void): this;

		parse(request: NextApiRequest): Promise<void>;
	}
}
