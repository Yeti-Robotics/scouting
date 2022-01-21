import { NextApiRequest } from 'next';
import { IncomingForm as FormidableForm } from 'formidable';

declare module 'formidable-serverless' {
	declare class IncomingForm extends FormidableForm {
		constructor(private options?: { [key: string]: any });

		on(event: string, callback: (name: string, file: { path: string }) => void): this;

		parse(request: NextApiRequest): Promise<void>;
	}
}
