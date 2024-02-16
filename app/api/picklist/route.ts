import verifyAdmin from '@/middleware/app-router/verify-user';
import { connectToDbB } from '@/middleware/connect-db';
import CompKey from '@/models/CompKey';
import PickList, { NewPicklistI, PickListI } from '@/models/PickList';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}

	await connectToDbB();

	const pickList = await PickList.find({});
	return NextResponse.json(pickList);
}

interface TBATeamSimpleI {
	key: string;
	team_number: number;
	nickname: string;
	name: string;
	city: string;
	state_prov: string;
	country: string;
}

export async function POST(req: NextRequest) {
	const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}

	await connectToDbB();
	const { name }: NewPicklistI = await req.json();
	const { compKey } = global.compKey;
	if (!compKey)
		return NextResponse.json({ message: 'Could not locate competition key' }, { status: 500 });
	const teams = await fetch(
		`https://www.thebluealliance.com/api/v3/event/${compKey}/teams/simple`,
		{
			next: { revalidate: 3600 },
			headers: {
				'X-TBA-Auth-Key': process.env.TBA_SECRET as string,
			},
		},
	)
		.then((res) => {
			console.log(res);
			return res.json();
		})
		.then((res) => {
			console.log(res);
			return res.map((team: TBATeamSimpleI) => team.team_number);
		})
		.catch(() => undefined);

	if (teams) {
		const np = new PickList({ name, ordering: teams });
		await np.save();
		return NextResponse.json({ insert_id: np._id.toString() });
	}
	return NextResponse.json({ message: 'oops' }, { status: 500 });
}

export async function PATCH(req: NextRequest) {
	const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}

	await connectToDbB();
	const body: PickListI = await req.json();
	try {
		await PickList.findByIdAndUpdate(body._id, { ordering: body.ordering });
	} catch {
		return NextResponse.json({ message: 'Failed to find picklist' }, { status: 500 });
	}
	return NextResponse.json({ message: 'success' });
}
