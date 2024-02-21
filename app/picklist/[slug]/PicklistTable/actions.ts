'use server';

import { connectToDbB } from '@/middleware/connect-db';
import PickList from '@/models/PickList';
import TeamAlliance, { TeamAllianceI } from '@/models/TeamAlliance';
import { revalidatePath } from 'next/cache';

async function getCurrentSelected() {
	await connectToDbB();
	const { compKey } = global.compKey;
	const currentState: TeamAllianceI[] = await TeamAlliance.find({ compKey }, { team_number: 1 });
	return new Set(currentState.map(({ team_number }) => team_number));
}

export async function onMarkSelected(team_number: number) {
	await connectToDbB();
	const { compKey } = global.compKey;
	await TeamAlliance.create({
		compKey,
		team_number,
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
