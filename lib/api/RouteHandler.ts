/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import CallableClass from '../CallableClass';
import { IncomingMessage, ServerResponse } from './types';

type ReqType<Type extends 'ssr' | 'api' | 'both'> = Type extends 'api'
	? NextApiRequest
	: Type extends 'both'
	? IncomingMessage
	: GetServerSidePropsContext['req'];

type ResType<Type extends 'ssr' | 'api' | 'both'> = Type extends 'api'
	? NextApiResponse
	: Type extends 'both'
	? ServerResponse
	: GetServerSidePropsContext['res'];

export type HandlerData<Type extends 'ssr' | 'api' = 'api', Req = {}, Res = {}> = {
	ignoredMiddleware: string[];
	handler: (req: ReqType<Type> & Req, res: ResType<Type> & Res) => void | Promise<void>;
};

export type RouteHandlerMiddleware<
	Type extends 'ssr' | 'api' | 'both' = 'api',
	Req = {},
	Res = {},
> = {
	key: string;
	ssr: boolean;
	middleware: (
		req: ReqType<Type> & Req,
		res: ResType<Type> & Res,
		end: (lastRes: (lastRes: Res) => void) => void,
		env: 'ssr' | 'api',
	) => void | Promise<void>;
};

export type RouteHandlerOnError<Type extends 'ssr' | 'api' = 'api'> = (
	req: ReqType<Type>,
	res: ResType<Type>,
	err: unknown,
) => void | Promise<void>;

interface RouteHandlerConstructor<Type extends 'ssr' | 'api' = 'api', Req = {}, Res = {}> {
	defaultMiddlewares?: RouteHandlerMiddleware<Type, ReqType<Type> & Req, ResType<Type> & Res>[];
	onError?: RouteHandlerOnError<Type>;
	ssr: true | false;
}

const resIsSent = (res: any): boolean => res.finished || res.headersSent || res.writableEnded;

const defaultHandler: (req: NextApiRequest, res: NextApiResponse) => void = (req, res) => {
	return res
		.status(405)
		.json({ message: `${req.method || 'No method'} is not allowed on this route.` });
};

const defaultSsrHandler: any = (
	req: GetServerSidePropsContext['req'],
	_: GetServerSidePropsContext['res'],
) => {
	return console.log(`${req.method || 'No method'} on ${req.url || 'no url'}.`);
};

const defaultIgnored: string[] = ['ALL'];

const defaultOnError: any = (req: NextApiRequest, res: NextApiResponse, err: unknown) => {
	console.error(err);
	return res.status(500).json({ message: 'Internal server error.' });
};

const debug = false;
export class RouteHandler<
	Type extends 'ssr' | 'api' = 'api',
	Req = {},
	Res = {},
> extends CallableClass {
	private ssr: boolean;
	private onError: RouteHandlerOnError<Type>;
	private middlewares: RouteHandlerMiddleware<Type, ReqType<Type> & Req, ResType<Type> & Res>[];
	private onGet: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;
	private onPost: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;
	private onPatch: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;
	private onPut: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;
	private onDelete: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;
	private onNoMethod: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;

	constructor(
		{
			ssr = false,
			onError,
			defaultMiddlewares = [],
		}: RouteHandlerConstructor<Type, ReqType<Type> & Req, ResType<Type> & Res> = {
			ssr: false,
			defaultMiddlewares: [],
		},
	) {
		super();

		this.onError = ssr ? onError || (() => {}) : onError || defaultOnError;
		this.middlewares = defaultMiddlewares;

		// default returns 405 with message method not allowed
		// default ignores all middleware
		this.onGet = {
			handler: ssr ? defaultSsrHandler : defaultHandler,
			ignoredMiddleware: defaultIgnored,
		};
		this.onPost = {
			handler: ssr ? defaultSsrHandler : defaultHandler,
			ignoredMiddleware: defaultIgnored,
		};
		this.onPatch = {
			handler: ssr ? defaultSsrHandler : defaultHandler,
			ignoredMiddleware: defaultIgnored,
		};
		this.onPut = {
			handler: ssr ? defaultSsrHandler : defaultHandler,
			ignoredMiddleware: defaultIgnored,
		};
		this.onDelete = {
			handler: ssr ? defaultSsrHandler : defaultHandler,
			ignoredMiddleware: defaultIgnored,
		};
		this.onNoMethod = {
			handler: ssr ? defaultSsrHandler : defaultHandler,
			ignoredMiddleware: defaultIgnored,
		};
		this.ssr = ssr;

		return this;
	}

	get(
		handler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>['handler'],
		ignoredMiddleware: string[] = [],
	) {
		this.onGet = { handler, ignoredMiddleware };
		return this;
	}

	post(
		handler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>['handler'],
		ignoredMiddleware: string[] = [],
	) {
		this.onPost = { handler, ignoredMiddleware };
		return this;
	}

	patch(
		handler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>['handler'],
		ignoredMiddleware: string[] = [],
	) {
		this.onPatch = { handler, ignoredMiddleware };
		return this;
	}

	put(
		handler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>['handler'],
		ignoredMiddleware: string[] = [],
	) {
		this.onPut = { handler, ignoredMiddleware };
		return this;
	}

	delete(
		handler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>['handler'],
		ignoredMiddleware: string[] = [],
	) {
		this.onDelete = { handler, ignoredMiddleware };
		return this;
	}

	noMethod(
		handler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>['handler'],
		ignoredMiddleware: string[] = [],
	) {
		this.onNoMethod = { handler, ignoredMiddleware };
		return this;
	}

	use(
		middleware: RouteHandlerMiddleware<
			'api' | 'ssr' | 'both',
			ReqType<Type> & Req,
			ResType<Type> & Res
		>,
	) {
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

	async run(req: ReqType<Type>, res: ResType<Type>) {
		let selectedHandler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;

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
						const end: (
							lastRes: (lastRes: ResType<Type> & Res) => void,
						) => void = async (lastRes) => {
							lastRes(res as ResType<Type> & Res);
							res.end();
							resolve();
						};

						if (resIsSent(res) || !middleware.ssr) return resolve();
						/* debug log */ debug && console.log(`middleware ${i} called`);
						if (!selectedHandler.ignoredMiddleware.includes(middleware.key))
							await middleware.middleware(
								req as ReqType<Type> & Req,
								res as ResType<Type> & Res,
								end,
								'ssr',
							);
						/* debug log */ debug && console.log(`middleware ${i} end`);

						// call handler at end of middleware chain and res end isn't called
						if (i === arr.length - 1 && !resIsSent(res)) {
							/* debug log */ debug && console.log(`handler called`);
							const handlerRes = await selectedHandler.handler(
								req as ReqType<Type> & Req,
								res as ResType<Type> & Res,
							);
							/* debug log */ debug && console.log(`handler end`);
							resolve(handlerRes);
						}
					});
				} else {
					// if not just call handler
					resolve(
						selectedHandler.handler(
							req as ReqType<Type> & Req,
							res as ResType<Type> & Res,
						),
					);
				}
			} catch (err: unknown) {
				const errorRes = this.onError(req, res, err);
				reject(errorRes);
			}
		});
	}

	async _call(req: ReqType<Type>, res: ResType<Type>) {
		if (this.ssr) return this.run(req, res);
		let selectedHandler: HandlerData<Type, ReqType<Type> & Req, ResType<Type> & Res>;

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
						const end: (
							lastRes: (lastRes: ResType<Type> & Res) => void,
						) => void = async (lastRes) => {
							lastRes(res as ResType<Type> & Res);
							res.end();
							resolve();
						};

						if (res.writableEnded) return resolve();
						/* debug log */ debug && console.log(`middleware ${i} called`);
						if (!selectedHandler.ignoredMiddleware.includes(middleware.key))
							await middleware.middleware(
								req as ReqType<Type> & Req,
								res as ResType<Type> & Res,
								end,
								'api',
							);
						/* debug log */ debug && console.log(`middleware ${i} end`);

						// call handler at end of middleware chain and res end isn't called
						if (i === arr.length - 1 && !res.writableEnded) {
							/* debug log */ debug && console.log(`handler called`);
							const handlerRes = await selectedHandler.handler(
								req as ReqType<Type> & Req,
								res as ResType<Type> & Res,
							);
							/* debug log */ debug && console.log(`handler end`);
							resolve(handlerRes);
						}
					});
				} else {
					// if not just call handler
					resolve(
						selectedHandler.handler(
							req as ReqType<Type> & Req,
							res as ResType<Type> & Res,
						),
					);
				}
			} catch (err: unknown) {
				const errorRes = this.onError(req, res, err);
				reject(errorRes);
			}
		});
	}
}
