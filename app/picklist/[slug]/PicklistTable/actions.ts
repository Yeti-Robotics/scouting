'use server';

import { connectToDbB } from '@/middleware/connect-db';
import PickList from '@/models/PickList';
import TeamAlliance, { TeamAllianceI } from '@/models/TeamAlliance';
import { revalidatePath } from 'next/cache';

async function getCurrentSelected() {
	await connectToDbB();
	const { compKey } = global.compKey;
	const currentAlliances = new Map<number, number>();
	await TeamAlliance.find({ compKey }, { team_number: 1, alliance_number: 1 }).then((res) => {
		res.forEach(({ team_number, alliance_number }) =>
			currentAlliances.set(team_number, alliance_number),
		);
	});
	return currentAlliances;
}

export async function onMarkSelected(team_number: number, alliance_number: number) {
	await connectToDbB();
	const { compKey } = global.compKey;
	await TeamAlliance.create({
		compKey,
		team_number,
		alliance_number,
	});
	return await getCurrentSelected();
}

export async function onMarkUnselected(team_number: number) {
	await connectToDbB();
	const { compKey } = global.compKey;
	await TeamAlliance.deleteOne({
		compKey,
		team_number,
	});
	return await getCurrentSelected();
}

export async function updatePicklist(items: number[], mongoId: string) {
	await connectToDbB();
	try {
		await PickList.findByIdAndUpdate(mongoId, { ordering: items });
	} catch (err) {
		console.log(err);
	}
	revalidatePath(`/picklist/${mongoId}`);
}
