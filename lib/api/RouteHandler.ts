import { NextApiRequest, NextApiResponse } from 'next';

type Handler<Req, Res> = (req: Req, res: Res) => void | Promise<void>;

export type Middleware<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> = (req: Req, res: Res) => void | Promise<void>;

interface Constructor<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> {
	defaultMiddlewares: Middleware<Req, Res>[];
	onError: (req: Req, res: Res, err: unknown) => void | Promise<void>;
}

const defaultHandler: Handler<NextApiRequest, NextApiResponse> = (req, res) => {
	res.status(400).send(
		'This is a default handler. Set it to something on your route handler object',
	);
};

const defaultOnError: Constructor<NextApiRequest, NextApiResponse>['onError'] = (_, res, err) => {
	console.error(err);
	return res.status(500).json({ message: 'Internal server error.' });
};

export class RouteHandler<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> extends Function {
	private _bound;
	private onError!: Constructor<Req, Res>['onError'];
	private middlewares!: Middleware<Req, Res>[];
	public post!: Handler<Req, Res>;
	public get!: Handler<Req, Res>;
	public patch!: Handler<Req, Res>;
	public put!: Handler<Req, Res>;
	public delete!: Handler<Req, Res>;

	constructor(
		{ onError = defaultOnError, defaultMiddlewares = [] }: Constructor<Req, Res> = {
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

	use(middleware: Middleware<Req, Res>) {
		this.middlewares.push(middleware);
		return this;
	}

	async callHandler(req: Req, res: Res) {
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
	}

	private async _call(...args: [Req, Res]) {
		const req = args[0];
		const res = args[1];

		return new Promise<void>((resolve, reject) => {
			try {
				const response = this.middlewares.map((middleware, i, arr) => {
					middleware(req, res);
					// call handler at end of middleware chain
					if (i === arr.length - 1) {
						const handlerRes = this.callHandler(req, res);
						return handlerRes;
					}
				})[0];
				resolve(response);
			} catch (err: unknown) {
				const errorRes = this.onError(req, res, err);
				reject(errorRes);
			}
		});
	}
}
