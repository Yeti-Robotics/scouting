import { NextApiRequest, NextApiResponse } from 'next';
import CallableClass from '../CallableClass';

export type HandlerData<Req, Res> = {
	ignoredMiddleware: string[];
	handler: (req: Req, res: Res) => void | Promise<void>;
};

export type RouteHandlerMiddleware<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> = {
	key: string;
	middleware: (
		req: Req,
		res: Res,
		end: (lastRes: (lastRes: Res) => void) => void,
	) => void | Promise<void>;
};

interface RouteHandlerConstructor<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> {
	defaultMiddlewares: RouteHandlerMiddleware<Req, Res>[];
	onError: (req: Req, res: Res, err: unknown) => void | Promise<void>;
}

const defaultHandler: (req: NextApiRequest, res: NextApiResponse) => void = (req, res) => {
	return res
		.status(405)
		.json({ message: `${req.method || 'No method'} is not allowed on this route.` });
};

const defaultIgnored: string[] = ['ALL'];

const defaultOnError: RouteHandlerConstructor<NextApiRequest, NextApiResponse>['onError'] = (
	_,
	res,
	err,
) => {
	console.error(err);
	return res.status(405).json({ message: 'Internal server error.' });
};

const debug = false;

export class RouteHandler<
	Req extends NextApiRequest = NextApiRequest,
	Res extends NextApiResponse = NextApiResponse,
> extends CallableClass {
	private onError!: RouteHandlerConstructor<Req, Res>['onError'];
	private middlewares!: RouteHandlerMiddleware<Req, Res>[];
	private onGet!: HandlerData<Req, Res>;
	private onPost!: HandlerData<Req, Res>;
	private onPatch!: HandlerData<Req, Res>;
	private onPut!: HandlerData<Req, Res>;
	private onDelete!: HandlerData<Req, Res>;
	private onNoMethod!: HandlerData<Req, Res>;

	constructor(
		{ onError = defaultOnError, defaultMiddlewares = [] }: RouteHandlerConstructor<Req, Res> = {
			onError: defaultOnError,
			defaultMiddlewares: [],
		},
	) {
		super();
		// Or without the spread/rest operator:
		// super('return this._bound._call.apply(this._bound, arguments)')

		this._.onError = onError;
		this._.middlewares = defaultMiddlewares;
		this._.onError;

		// default returns 405 with message method not allowed
		// default ignores all middleware
		this._.onGet = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		this._.onPost = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		this._.onPatch = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		this._.onPut = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		this._.onDelete = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };
		this._.onNoMethod = { handler: defaultHandler, ignoredMiddleware: defaultIgnored };

		return this._;
	}

	get(handler: (req: Req, res: Res) => void | Promise<void>, ignoredMiddleware: string[] = []) {
		this.onGet = { handler, ignoredMiddleware };
		return this;
	}

	post(handler: (req: Req, res: Res) => void | Promise<void>, ignoredMiddleware: string[] = []) {
		this.onPost = { handler, ignoredMiddleware };
		return this;
	}

	patch(handler: (req: Req, res: Res) => void | Promise<void>, ignoredMiddleware: string[] = []) {
		this.onPatch = { handler, ignoredMiddleware };
		return this;
	}

	put(handler: (req: Req, res: Res) => void | Promise<void>, ignoredMiddleware: string[] = []) {
		this.onPut = { handler, ignoredMiddleware };
		return this;
	}

	delete(
		handler: (req: Req, res: Res) => void | Promise<void>,
		ignoredMiddleware: string[] = [],
	) {
		this.onDelete = { handler, ignoredMiddleware };
		return this;
	}

	noMethod(
		handler: (req: Req, res: Res) => void | Promise<void>,
		ignoredMiddleware: string[] = [],
	) {
		this.onNoMethod = { handler, ignoredMiddleware };
		return this;
	}

	use(middleware: RouteHandlerMiddleware<Req, Res>) {
		if (middleware.key === 'ALL') throw new Error('Middleware key "ALL" is reserved.');
		if (!middleware.key || !middleware.middleware)
			throw new Error(
				'Middleware should have the shape of { key: string, middleware: (req, res, end) => void | Promise<void> }. You are missing the key, middleware, or both.',
			);
		if (this.middlewares.find((mid) => mid.key === middleware.key))
			throw new Error(
				`A middle ware is already using key: "${middleware.key}". Choose another key.`,
			);

		this.middlewares.push(middleware);
		return this;
	}

	async _call(req: Req, res: Res) {
		let selectedHandler: HandlerData<Req, Res>;

		return new Promise<void>((resolve, reject) => {
			try {
				switch (req.method) {
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
						selectedHandler = this.onNoMethod;
				}

				if (!selectedHandler.ignoredMiddleware.includes('ALL') && this.middlewares[0]) {
					// if have middleware and no ALL skip run middleware
					this.middlewares.forEach(async (middleware, i, arr) => {
						// function to end request
						const end: (lastRes: (lastRes: Res) => void) => void = async (lastRes) => {
							lastRes(res);
							res.end();
							resolve();
						};

						if (res.writableEnded) return resolve();
						/* debug log */ debug && console.log(`middleware ${i} called`);
						if (!selectedHandler.ignoredMiddleware.includes(middleware.key))
							await middleware.middleware(req, res, end);
						/* debug log */ debug && console.log(`middleware ${i} end`);

						// call handler at end of middleware chain and res end isn't called
						if (i === arr.length - 1 && !res.writableEnded) {
							/* debug log */ debug && console.log(`handler called`);
							const handlerRes = await selectedHandler.handler(req, res);
							/* debug log */ debug && console.log(`handler end`);
							resolve(handlerRes);
						}
					});
				} else {
					// if not just call handler
					resolve(selectedHandler.handler(req, res));
				}
			} catch (err: unknown) {
				const errorRes = this.onError(req, res, err);
				reject(errorRes);
			}
		});
	}
}
