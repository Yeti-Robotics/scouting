import verifyAdmin from '@/middleware/app-router/verify-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}
	return NextResponse.json({ message: 'success' });
}
