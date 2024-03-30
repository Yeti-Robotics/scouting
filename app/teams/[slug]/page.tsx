import Chart from '@/components/TeamAnalysis/Chart';
import Image from 'next/image';
import PitForm from '@/models/PitForm';
import PitImage from '@/models/PitImage';
import QuickStats from '@/components/TeamAnalysis/QuickStats';
import StandForm from '@/models/StandForm';
import { connectToDbB } from '@/middleware/connect-db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	PerMatchStandFormGroup,
	getPerMatchAggregation,
} from '@/models/aggregations/perMatchAverage';
import { toBase64 } from '@/lib/toBase64';
import { RawTeamData } from '@/models/aggregations/teamData';
import { teamDataAggregation } from '@/models/aggregations/teamData';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

async function getTeamData(teamNumber: number) {
	await connectToDbB();
	const data: RawTeamData[] = await StandForm.aggregate<RawTeamData>([
		{ $match: { teamNumber: teamNumber } },
		...teamDataAggregation,
	]);
	const standForms = await StandForm.aggregate<PerMatchStandFormGroup>(
		getPerMatchAggregation(teamNumber),
	).sort({
		'_id.matchNumber': 1,
	});
	const pitForms = await PitForm.find({ teamNumber: teamNumber });
	const pitImages = await PitImage.find({ teamNumber: teamNumber });

	return { team: data[0], standForms, pitForms, pitImages };
}

function getQuickStats(teamData: RawTeamData) {
	return [
		{
			label: 'ANS',
			value: teamData.avgAmpNotes,
			popoverContent: 'Avg. Amps Notes Scored',
		},
		{
			label: 'SNS',
			value: teamData.avgSpeakerNotes,
			popoverContent: 'Avg. Speaker Notes Scored',
		},
		{
			label: 'EPA',
			value: teamData.epa,
			popoverContent: 'Expected Points Added',
		},
		{
			label: 'WPA',
			value: teamData.WPA,
			popoverContent: 'Win Probability Added',
		},
	];
}

export default async function TeamPage({ params }: { params: { slug: string } }) {
	const teamNumber = parseInt(params.slug);
	if (isNaN(teamNumber)) {
		return <div>Invalid team number.</div>;
	}
	const teamData = await getTeamData(teamNumber);
	if (!teamData.team) return <div>Not Found</div>;

	const quickStats = getQuickStats(teamData.team);

	return (
		<main className='container my-8 w-full max-w-5xl space-y-4 pb-16'>
			<header>
				<h1 className='typography break-words'>{teamData.team.teamName}</h1>
				<p className='lead'>Team {teamData.team.teamNumber} </p>
			</header>
			<section className=''>
				<QuickStats stats={quickStats} />
			</section>
			<section className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
				<Card>
					<CardHeader className='p-6'>
						<CardTitle>Points Scored</CardTitle>
						<CardDescription>Points Scored by Match</CardDescription>
					</CardHeader>
					<CardContent className='p-6 pt-0'>
						<Chart
							data={teamData.standForms}
							series={['epa', 'autoScore', 'teleopScore']}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='p-6'>
						<CardTitle>Amp Notes</CardTitle>
						<CardDescription>Amp Notes Scored by Match</CardDescription>
					</CardHeader>
					<CardContent className='p-6 pt-0'>
						<Chart
							data={teamData.standForms}
							series={['autoAmpNotes', 'teleopAmpNotes', 'totalAmpNotes']}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='p-6'>
						<CardTitle>Speaker Notes</CardTitle>
						<CardDescription>Speaker Notes Scored by Match</CardDescription>
					</CardHeader>
					<CardContent className='p-6 pt-0'>
						<Chart
							data={teamData.standForms}
							series={[
								'autoSpeakerNotes',
								'teleopSpeakerNotes',
								'teleopAmplifiedSpeakerNotes',
								'totalSpeakerNotes',
							]}
						/>
					</CardContent>
				</Card>
			</section>
			<section className='w-full'>
				<h2 className='typography'>Advanced Metrics</h2>
				<div className='mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3'>
					<Card>
						<CardHeader className='p-6'>
							<CardTitle>Win Probability Added (WPA)</CardTitle>
						</CardHeader>
						<CardContent className='p-6 pt-0'>
							<h3 className='text-3xl font-bold'>{teamData.team.WPA}%</h3>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='p-6'>
							<CardTitle>Auto WPA</CardTitle>
						</CardHeader>
						<CardContent className='p-6 pt-0'>
							<h3 className='text-3xl font-bold'>{teamData.team.autoWPA}%</h3>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='p-6'>
							<CardTitle>Auto %RSD</CardTitle>
						</CardHeader>
						<CardContent className='p-6 pt-0'>
							<h3 className='text-3xl font-bold'>
								{teamData.team.autoConsistency &&
									Math.round(teamData.team.autoConsistency * 10000) / 100}
								%
							</h3>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='p-6'>
							<CardTitle>Overall %RSD</CardTitle>
						</CardHeader>
						<CardContent className='p-6 pt-0'>
							<h3 className='text-3xl font-bold'>
								{teamData.team.epaDev &&
									Math.round((teamData.team.epa / teamData.team.epaDev) * 10000) /
										100}
								%
							</h3>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='p-6'>
							<CardTitle>tASN/tSN</CardTitle>
						</CardHeader>
						<CardContent className='p-6 pt-0'>
							<h3 className='text-3xl font-bold'>
								{teamData.team.teleopSpeakerAmplifiedRatio}
							</h3>
						</CardContent>
					</Card>
				</div>
			</section>
			<section className='w-full'>
				<h2 className='typography'>Comments</h2>
				<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
					{teamData.standForms.map((form) => {
						return (
							<Card key={form._id.matchNumber}>
								<CardHeader className='p-6'>
									<CardTitle>Match {form._id.matchNumber}</CardTitle>
								</CardHeader>
								<CardContent className='p-6 pt-0'>
									<ul className='mt-0'>
										{form.notes.map((note, index) => {
											return (
												<li key={index}>
													<blockquote
														className='typography mb-4'
														style={{ marginTop: 0 }}
													>
														"{note}"
													</blockquote>
												</li>
											);
										})}
									</ul>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
			<section className='w-full'>
				<h2 className='typography'>Pit Info</h2>
				{teamData.pitForms.map((form) => {
					return (
						<div key={form._id} className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5'>
							<Card>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>Drivetrain</CardTitle>
								</CardHeader>
								<CardContent className='p-6 pt-0'>
									<h5
										className={
											form.drivetrain === 'Swerve'
												? 'font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Swerve
									</h5>
									<h5
										className={
											form.drivetrain === 'West Coast'
												? 'font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										West Coast
									</h5>
									<h5
										className={
											form.drivetrain === 'Mechaunum'
												? 'font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Mechaunum
									</h5>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>
										Weight (lbs)
									</CardTitle>
								</CardHeader>
								<CardContent className='p-6 pt-0'>
									<h1 className='text-center text-6xl font-bold'>
										{form.weight}
									</h1>
								</CardContent>
							</Card>
							<Card className='col-span-2'>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>
										Length x Width (in)
									</CardTitle>
								</CardHeader>
								<CardContent className='p-6 pt-0'>
									<h1 className='text-center text-6xl font-bold'>
										{form.length} x {form.width}
									</h1>
								</CardContent>
							</Card>
							<Card key={form._id}>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>
										Where Score?
									</CardTitle>
								</CardHeader>
								<CardContent className='p-6 pt-0'>
									<h5
										className={
											form.whereScore[0] === 'Amp'
												? ' font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Amp
									</h5>
									<h5
										className={
											form.whereScore[0] === 'Speaker' ||
											form.whereScore[1] === 'Speaker'
												? 'font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Speaker
									</h5>
									<h5
										className={
											form.whereScore.length === 0
												? 'font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Neither
									</h5>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>Preference</CardTitle>
								</CardHeader>
								<CardContent className='p-6 pt-0'>
									<h5
										className={
											form.priorityScore === 'Amp'
												? ' font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Amp
									</h5>
									<h5
										className={
											form.priorityScore === 'Speaker'
												? 'font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Speaker
									</h5>
									<h5
										className={
											form.priorityScore === 'None'
												? 'font-bold'
												: 'font-bold text-gray-400 text-opacity-50'
										}
									>
										Neither
									</h5>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>Can Climb?</CardTitle>
								</CardHeader>
								<CardContent className='flex justify-center p-6 pt-0'>
									{form.climb ? (
										<CheckIcon className='size-20' />
									) : (
										<Cross2Icon className='size-20' />
									)}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>Can Trap?</CardTitle>
								</CardHeader>
								<CardContent className='flex justify-center p-6 pt-0'>
									{form.trapScore ? (
										<CheckIcon className='size-20' />
									) : (
										<Cross2Icon className='size-20' />
									)}
								</CardContent>
							</Card>
							<Card className='col-span-2'>
								<CardHeader className='p-6 pb-4'>
									<CardTitle className='text-md font-bold'>Notes</CardTitle>
								</CardHeader>
								<CardContent className='p-6 pt-0'>
									<blockquote
										className='typography mb-4'
										style={{ marginTop: 0 }}
									>
										"{form.notes}"
									</blockquote>
								</CardContent>
							</Card>
						</div>
					);
				})}
			</section>
			<section className='w-full'>
				<div>
					<h2 className='typography'>Robot Images</h2>
					{!teamData.pitImages || !teamData.pitImages[0] ? (
						<p className='lead'>No images found for this team.</p>
					) : (
						<div className='mt-4 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4'>
							{teamData.pitImages.map((image) => {
								return (
									<div className='relative flex aspect-square flex-wrap overflow-clip rounded-lg object-cover'>
										<Image
											key={image._id}
											className='object-cover'
											src={`data:image/webp;base64,${toBase64(image.data as unknown as Uint8ClampedArray)}`}
											alt='Pit Image'
											fill
										/>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
/*

	return (
		<Stack p='md' w='100%'>
			<PitInfo pitForm={pitForms[0]} />
			<TeamStats team={team} standForms={standForms} />
			<Comments forms={standForms} />
		</Stack>
	);
};
*/

export const revalidate = 60;
