import { UserI } from '@/models/User';
import { NextApiRequest } from 'next';
import http from 'http';
import { Document } from 'mongoose';

export interface ReqWUser extends NextApiRequest {
	user: UserI;
}

export type ServerResponse<T = undefined> = T extends undefined
	? http.ServerResponse
	: http.ServerResponse & T;
export type IncomingMessage<T = undefined> = T extends undefined
	? http.IncomingMessage
	: http.IncomingMessage & T;

export type WAuth = { user: UserI };
export type WCookies = { cookies: { [key: string]: string } };

/** because mongoose sugs T is type of the document, P is parent, O is owner */
export interface Subdocument<T, P = any, O = P> extends Document<T> {
	$isSingleNested: true;

	/** Returns the top level document of this sub-document. */
	ownerDocument(): Document<O>;

	/** Returns this sub-documents parent document. */
	parent(): Document<P>;

	/** Returns this sub-documents parent document. */
	$parent(): Document<P>;
}
