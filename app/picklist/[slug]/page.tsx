import PickList from '@/models/PickList';
import PickListTable from '@/components/PicklistTable';
import mongoose from 'mongoose';
import StandForm from '@/models/StandForm';
import { avgDataPipeline } from '@/models/aggregations/averageData';
import { connectToDbB } from '@/middleware/connect-db';
import { firstPickWeights, secondPickWeights } from '@/lib/analysis/pickability-weights';
import { PickabilityWeightsI, TeamAvgsI } from '@/lib/types/Pickability';

/**
 * Computes pickability using specified weights -- essentially computes a weighted sum
 * @param team - team number
 * @param weights - weights, examples defined in weights.ts
 * @see weights.ts
 *
 * @returns pickability generated using weights
 */
function computeTeamPickability(team: TeamAvgsI, weights: PickabilityWeightsI) {
	return Object.keys(weights).reduce((prev: number, key: string | number) => {
		if (key === 'climbRate') {
			return prev + (team.climbSuccess * weights.climbRate) / team.forms;
		} else {
			return (
				prev +
				team[key as keyof PickabilityWeightsI] * weights[key as keyof PickabilityWeightsI]
			);
		}
	}, 0);
}

export async function generateStaticParams() {
	await connectToDbB();
	const picklists = await PickList.find({}, { _id: 1 });
	const slugs = picklists.map(({ _id }) => ({ slug: _id.toString() }));
	return slugs;
}

export default async function PicklistPage({ params }: { params: { slug: string } }) {
	await connectToDbB();
	const objectId = new mongoose.Types.ObjectId(params.slug);
	const averages = await StandForm.aggregate<TeamAvgsI>(avgDataPipeline).then((res) =>
		res
			.map((team) => ({
				...team,
				firstPickability: computeTeamPickability(team, firstPickWeights),
				secondPickability: computeTeamPickability(team, secondPickWeights),
				climbRate: 100 * (team.climbSuccess / team.forms),
			}))
			.sort((b, a) => a.firstPickability - b.firstPickability),
	);
	const picklist = await PickList.findById(objectId).exec();

	if (picklist && averages) {
		type TeamNumber = number;
		type TeamIndexMap = Record<TeamNumber, number>;
		const {
			name,
			ordering,
			updatedAt,
		}: { name: string; ordering: TeamNumber[]; updatedAt: Date } = picklist;
		const parsedPicklist = { name, ordering, updatedAt: updatedAt.toDateString() };
		const indices: TeamIndexMap = {};
		ordering.forEach((team, index) => (indices[team] = index));
		averages.sort((a, b) => indices[a._id as TeamNumber] - indices[b._id as TeamNumber]);
		return (
			<main className='mx-auto ml-4 mt-16 p-6'>
				<h1 className='typography mb-4 text-primary'>{name}</h1>
				<p className='lead mb-6'>Last Updated • {parsedPicklist.updatedAt}</p>
				<PickListTable data={averages} picklist={parsedPicklist} />
			</main>
		);
	} else {
		return <div>picklist not found</div>;
	}
}
