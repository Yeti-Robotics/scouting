import StandForm from '@/models/StandForm';
import PickList from '@/models/PickList';
import PickListTable from '@/components/PicklistTable';
import { TeamAvgsI, PickabilityWeightsI } from '@/lib/types/Pickability';
import { avgDataPipeline } from '@/models/aggregations/averageData';
import { firstPickWeights, secondPickWeights } from '../../lib/analysis/pickability-weights';
import { connectToDbB } from '@/middleware/connect-db';

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

/**
 * RSC responsible for obtaining initial data and returning the picklist table.
 * @returns page containing DnD picklist
 */
export default async function PickListPage() {
	// Connect to DB, get AVGs, sort by first
	await connectToDbB();
	const averages = await StandForm.aggregate<TeamAvgsI>(avgDataPipeline).then((res) =>
		res
			.map((team) => ({
				...team,
				firstPickability: computeTeamPickability(team, firstPickWeights),
				secondPickability: computeTeamPickability(team, secondPickWeights),
				climbRate: 100 * (team.climbSuccess / team.forms)
			}))
			.sort((b, a) => a.firstPickability - b.firstPickability),
	);
	const picklists = (await PickList.find({}))?.map(({ name, ordering }) => ({ name, ordering }));

	return (
		<main className='mx-auto p-6 mt-16 ml-4'>
			<h1 className='text-primary mb-4'>YETI Scouting Picklist</h1>
			<PickListTable data={averages} picklists={picklists} />
		</main>
	);
}