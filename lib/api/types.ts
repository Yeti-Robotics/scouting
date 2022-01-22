import { UserI } from '@/models/User';
import { NextApiRequest } from 'next';

export interface ReqWUser extends NextApiRequest {
	user: UserI;
}
