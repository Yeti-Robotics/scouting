import { authToken } from '@/middleware/auth';
import { connectToDbB } from '@/middleware/connect-db';

export default async function verifyAdmin(access_token: string | undefined) {
	await connectToDbB();
	const user = await authToken(access_token);
	if (!user || !user.administrator) {
		return false;
	}

	return true;
}
