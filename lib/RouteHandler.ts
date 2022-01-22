import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

interface Handler extends NextApiHandler {}

type Middleware = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

interface Constructor {
	defaultMiddlewares: Middleware[];
	onError: (req: NextApiRequest, res: NextApiResponse, err: unknown) => void | Promise<void>;
}

const defaultHandler: Handler = (req, res) => {
	res.status(400).send(
		'This is a default handler. Set it to something on your route handler object',
	);
};

const defaultOnError: Constructor['onError'] = (_, res, err) => {
	console.error(err);
	return res.status(500).json({ message: 'Internal server error.' });
};

export class RouteHandler extends Function {
	private _bound!: any;
	private onError!: Constructor['onError'];
	private middlewares!: Middleware[];
	public post!: Handler;
	public get!: Handler;
	public patch!: Handler;
	public put!: Handler;
	public delete!: Handler;

	constructor(
		{ onError = defaultOnError, defaultMiddlewares = [] }: Constructor = {
			onError: defaultOnError,
			defaultMiddlewares: [],
		},
	) {
		super('...args', 'return this._bound._call(...args)');
		// Or without the spread/rest operator:
		// super('return this._bound._call.apply(this._bound, arguments)')

		const _this = this.bind(this);
		this._bound = _this;

		_this.onError = onError;
		_this.middlewares = defaultMiddlewares;
		_this.onError;
		_this.post = defaultHandler;
		_this.get = defaultHandler;
		_this.patch = defaultHandler;
		_this.put = defaultHandler;
		_this.delete = defaultHandler;

		return _this;
	}

	use(middleware: Middleware) {
		this.middlewares.push(middleware);
		return this;
	}

	private _call(...args: [NextApiRequest, NextApiResponse]) {
		const req = args[0];
		const res = args[1];

		try {
			this.middlewares.forEach(async (middleware) => {
				await middleware(req, res);
			});
			switch (req.method?.toUpperCase()) {
				case 'GET':
					return this.get(req, res);
				case 'POST':
					return this.post(req, res);
				case 'PATCH':
					return this.patch(req, res);
				case 'PUT':
					return this.put(req, res);
				case 'DELETE':
					return this.delete(req, res);
				default:
					throw new Error('No valid method on request.');
			}
		} catch (err: unknown) {
			this.onError(req, res, err);
		}
	}
}
