import { NextApiRequest, NextApiResponse } from 'next';

type HandlerData<Req, Res> = {
	ignoredMiddleware: number[];
	handler: (req: Req, res: Res) => void | Promise<void>;
};

export type Middleware<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> = (req: Req, res: Res, end: (lastRes: (lastRes: Res) => void) => void) => void | Promise<void>;

interface Constructor<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> {
	defaultMiddlewares: Middleware<Req, Res>[];
	onError: (req: Req, res: Res, err: unknown) => void | Promise<void>;
}

const defaultHandler: (req: NextApiRequest, res: NextApiResponse) => void = (req, res) => {
	res.status(400).send(
		'This is a default handler. Set it to something on your route handler object',
	);
};

const defaultIgnored: number[] = [];

const defaultOnError: Constructor<NextApiRequest, NextApiResponse>['onError'] = (_, res, err) => {
	console.error(err);
	return res.status(500).json({ message: 'Internal server error.' });
};

const debug = false;

export class RouteHandler<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> extends Function {
	private _bound;
	private onError!: Constructor<Req, Res>['onError'];
	private middlewares!: Middleware<Req, Res>[];
	private onGet!: HandlerData<Req, Res>;
	private onPost!: HandlerData<Req, Res>;
	private onPatch!: HandlerData<Req, Res>;
	private onPut!: HandlerData<Req, Res>;
	private onDelete!: HandlerData<Req, Res>;

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

		_this.onGet = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		_this.onPost = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		_this.onPatch = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		_this.onPut = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		_this.onDelete = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };

		return _this;
	}

	get(handler: (req: Req, res: Res) => void | Promise<void>, ignoreMiddleware: number[] = []) {
		this.onGet.handler = handler;
		this.onGet.ignoredMiddleware = ignoreMiddleware;
		return this;
	}

	post(handler: (req: Req, res: Res) => void | Promise<void>, ignoreMiddleware: number[] = []) {
		this.onPost.handler = handler;
		this.onPost.ignoredMiddleware = ignoreMiddleware;
		return this;
	}

	patch(handler: (req: Req, res: Res) => void | Promise<void>, ignoreMiddleware: number[] = []) {
		this.onPatch.handler = handler;
		this.onPatch.ignoredMiddleware = ignoreMiddleware;
		return this;
	}

	put(handler: (req: Req, res: Res) => void | Promise<void>, ignoreMiddleware: number[] = []) {
		this.onPut.handler = handler;
		this.onPut.ignoredMiddleware = ignoreMiddleware;
		return this;
	}

	delete(handler: (req: Req, res: Res) => void | Promise<void>, ignoreMiddleware: number[] = []) {
		this.onDelete.handler = handler;
		this.onDelete.ignoredMiddleware = ignoreMiddleware;
		return this;
	}

	use(middleware: Middleware<Req, Res>) {
		this.middlewares.push(middleware);
		return this;
	}

	private async _call(...args: [Req, Res]) {
		const req = args[0];
		const res = args[1];
		let selectedHandler: HandlerData<Req, Res>;

		return new Promise<void>((resolve, reject) => {
			try {
				switch (req.method?.toUpperCase()) {
					case 'GET':
						selectedHandler = this.onGet;
						break;
					case 'POST':
						selectedHandler = this.onPost;
						break;
					case 'PATCH':
						selectedHandler = this.onPatch;
						break;
					case 'PUT':
						selectedHandler = this.onPut;
						break;
					case 'DELETE':
						selectedHandler = this.onDelete;
						break;
					default:
						resolve();
				}
				this.middlewares[0] // if have middleware run them
					? this.middlewares.map(async (middleware, i, arr) => {
							if (selectedHandler.ignoredMiddleware.includes(i)) return;
							// function to end request
							const end: (lastRes: (lastRes: Res) => void) => void = async (
								lastRes,
							) => {
								lastRes(res);
								res.end();
								resolve();
							};

							if (res.writableEnded) return resolve();
							/* debug log */ debug && console.log(`middleware ${i} called`);
							await middleware(req, res, end);
							/* debug log */ debug && console.log(`middleware ${i} end`);

							// call handler at end of middleware chain i res end isn't called
							if (i === arr.length - 1 && !res.writableEnded) {
								/* debug log */ debug && console.log(`handler called`);
								const handlerRes = await selectedHandler.handler(req, res);
								/* debug log */ debug && console.log(`handler end`);
								resolve(handlerRes);
							}
					  })[this.middlewares.length - 1]
					: resolve(selectedHandler.handler(req, res)); // if not just call handler
			} catch (err: unknown) {
				const errorRes = this.onError(req, res, err);
				reject(errorRes);
			}
		});
	}
}
