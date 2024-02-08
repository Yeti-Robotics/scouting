import verifyAdmin from '@/middleware/app-router/verify-admin';
import { connectToDbB } from '@/middleware/connect-db';
import PickList, { NewPicklistI } from '@/models/PickList';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}

    await connectToDbB();
    const pickList=await PickList.find({});
	return NextResponse.json(pickList);
}

export async function POST(req: NextRequest) {
    const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}
    
    await connectToDbB()
    const body: NewPicklistI = await req.json()
    await PickList.create(body);
	return NextResponse.json({ message: 'success' });
}

export async function PATCH(req: NextRequest) {
    const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}
    
    await connectToDbB()
    const body: NewPicklistI = await req.json()
    await PickList.updateOne({name: body.name}, body);
	return NextResponse.json({ message: 'success' });
}
