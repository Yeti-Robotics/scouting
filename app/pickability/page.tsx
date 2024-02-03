import StandForm from '@/models/StandForm';
import { avgDataPipeline } from '@/models/aggregations/averageData';
import { firstPickWeights, secondPickWeights } from './weights';
import PickListTable from './PickabilityTable';
import { connectToDbB } from '@/middleware/connect-db';

interface PickabilityWeightsI {
	autoAmpNotes: number;
	autoSpeakerNotes: number;
	teleopAmpNotes: number;
	teleopSpeakerNotes: number;
	teleopAmplifiedSpeakerNotes: number;
	trapNotes: number;
	climbRate: number;
	defense: number;
}

export interface TeamAvgsI extends PickabilityWeightsI {
	_id: number;
	climbSuccess: number;
	forms: number;
}

export interface TeamDerivedStatsI extends TeamAvgsI {
	firstPickability: number;
	secondPickability: number;
}

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
export default async function PickList() {
	// Connect to DB, get AVGs, sort by first
	await connectToDbB();
	const averages = await StandForm.aggregate<TeamAvgsI>(avgDataPipeline).then((res) =>
		res
			.map((team) => ({
				...team,
				firstPickability: computeTeamPickability(team, firstPickWeights),
				secondPickability: computeTeamPickability(team, secondPickWeights),
			}))
			.sort((b, a) => a.firstPickability - b.firstPickability),
	);
	return (
		<main className='mx-auto max-w-[540px]'>
			<PickListTable data={averages} />
		</main>
	);
}
