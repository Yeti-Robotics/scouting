import { UserI } from '@/models/User';
import { NextApiRequest } from 'next';
import http from 'http';

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
