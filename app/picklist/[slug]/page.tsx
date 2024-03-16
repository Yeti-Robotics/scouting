import PickList, { PickListI } from '@/models/PickList';
import PickListTable from './PicklistTable';
import StandForm from '@/models/StandForm';
import TeamContextProvider from './team-context-provider';
import { avgDataPipeline } from '@/models/aggregations/averageData';
import { connectToDbB } from '@/middleware/connect-db';
import { firstPickWeights, secondPickWeights } from '@/lib/analysis/pickability-weights';
import { PickabilityWeightsI, TeamAvgsI, TeamDerivedStatsI } from '@/lib/types/Pickability';
import { DeleteButton, UpdateButton } from '../crud-components';
import TeamAlliance from '@/models/TeamAlliance';
import BestAvailable from './BestAvailable';
import { cookies } from 'next/headers';
import verifyAdmin from '@/middleware/app-router/verify-user';

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
 * Retrieves the averages of team data.
 * @returns {Promise<TeamAvgsI[]>} A promise that resolves to an array of team averages.
 */
async function getDerivedStatistics(): Promise<TeamDerivedStatsI[]> {
	return await StandForm.aggregate<TeamAvgsI>(avgDataPipeline).then((res) =>
		res.map((team) => ({
			...team,
			firstPickability: computeTeamPickability(team, firstPickWeights),
			secondPickability: computeTeamPickability(team, secondPickWeights),
			climbRate: 100 * (team.climbSuccess / team.forms),
		})),
	);
}

async function getPicklist(_id: string): Promise<PickListI | null> {
	return await PickList.findById(_id).exec();
}

/**
 * Generates an empty row.
 * @param _id - The team id
 * @returns An object representing a team with no data collected yet.
 */
function generateEmptyRow(_id: number): TeamDerivedStatsI {
	return {
		_id: _id,
		autoAmpNotes: 0,
		autoSpeakerNotes: 0,
		teleopAmpNotes: 0,
		teleopSpeakerNotes: 0,
		teleopAmplifiedSpeakerNotes: 0,
		trapNotes: 0,
		climbRate: 0,
		firstPickability: 0,
		secondPickability: 0,
		forms: 0,
		climbSuccess: 0,
		defense: 0,
	};
}

/**
 * Generates static parameters for the page.
 * @returns The array of slugs, representing Picklist _ids.
 */
export async function generateStaticParams() {
	await connectToDbB();
	const picklists = await PickList.find({}, { _id: 1 });
	const slugs = picklists.map(({ _id }) => ({ slug: _id.toString() }));
	return slugs;
}

/**
 * Renders the PicklistPage component.
 *
 * @param params - The parameters object containing the slug.
 * @param params.slug - The slug used to fetch the picklist.
 * @returns The rendered PicklistPage component.
 */
export default async function PicklistPage({ params }: { params: { slug: string } }) {
	const access_token = cookies().get('access_token')?.value;
	const isAdmin = await verifyAdmin(access_token);
	if (!isAdmin) {
		return <div>Unauthorized</div>;
	}
	await connectToDbB();
	// Retrieve the derived statistics and picklist
	let derivedStatistics = await getDerivedStatistics();
	const picklist = await getPicklist(params.slug);
	const selected = new Map();
	await TeamAlliance.find(
		{ compKey: global.compKey.compKey },
		{ team_number: 1, alliance_number: 1 },
	).then((res) => {
		res.forEach(({ team_number, alliance_number }) => {
			selected.set(team_number, alliance_number);
		});
	});
	// Return error if problem fetching data
	if (!picklist || !derivedStatistics) {
		return <div>Error fetching data, or picklist does not exist</div>;
	}
	const { name, ordering, updatedAt } = picklist;
	// Create a map to store the indices of teams, constant-time lookup reduces time complexity
	// of sorting derived statistics
	const indices: Map<number, number> = new Map();
	// Create a set to store the teams with data
	const teamsWithData = new Set(derivedStatistics.map(({ _id }) => _id));
	// Iterate through the ordering and populate the indices map
	ordering.forEach((_id, index) => {
		indices.set(_id, index);
		// If a team does not have data, generate an empty row for it
		if (!teamsWithData.has(_id)) {
			derivedStatistics.push(generateEmptyRow(_id));
		}
	});
	// Filter and sort the derived statistics based on the ordering
	derivedStatistics = derivedStatistics
		.filter((team) => ordering.indexOf(team._id) > -1)
		.sort((a, b) => (indices.get(a._id) as number) - (indices.get(b._id) as number));
	// Render the PicklistPage component
	return (
		<main className='container'>
			<div className='flex-1 space-y-4 py-6 sm:p-8'>
				<TeamContextProvider initialState={derivedStatistics} selectedTeams={selected}>
					<header className='flex-1 space-y-4'>
						<div className='flex flex-wrap items-center justify-between space-y-2'>
							<h1 className='typography'>{name}</h1>
							<div className='w-full sm:w-min'>
								<UpdateButton mongoId={params.slug} />
								<DeleteButton mongoId={params.slug} />
							</div>
						</div>
						<p className='lead'>Last Updated • {updatedAt.toDateString()}</p>
					</header>
					<section>
						<BestAvailable />
					</section>
					<section>
						<PickListTable />
					</section>
				</TeamContextProvider>
			</div>
		</main>
	);
}

export const dynamic = 'force-dynamic';
