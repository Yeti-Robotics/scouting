import Chart from '@/components/TeamAnalysis/Chart';
import Image from 'next/image';
import PitForm from '@/models/PitForm';
import PitImage from '@/models/PitImage';
import QuickStats from '@/components/TeamAnalysis/QuickStats';
import StandForm from '@/models/StandForm';
import { connectToDbB } from '@/middleware/connect-db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPerMatchAggregation } from '@/models/aggregations/perMatchAverage';
import { toBase64 } from '@/lib/toBase64';
import { RawTeamData } from '@/models/aggregations/teamData';
import { teamDataAggregation } from '@/models/aggregations/teamData';

async function getTeamData(teamNumber: number) {
	await connectToDbB();
	const data: RawTeamData[] = await StandForm.aggregate<RawTeamData>([
		...teamDataAggregation,
		{ $match: { teamNumber: teamNumber } },
	]);
	const standForms = await StandForm.aggregate(getPerMatchAggregation(teamNumber)).sort({
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
		<main className='container my-8 w-full max-w-7xl space-y-4'>
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
						<CardTitle>Amp Notes</CardTitle>
						<CardDescription>Amp Notes Scored by Match</CardDescription>
					</CardHeader>
					<CardContent className='p-6 pt-0'>
						<Chart
							data={teamData.standForms}
							series={['autoAmpNotes', 'teleopAmpNotes']}
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
							]}
						/>
					</CardContent>
				</Card>
			</section>
			<section className='w-full'>
				<h2 className='typography'>Advanced Metrics</h2>
				<div className='mt-4'></div>
			</section>
			<section className='w-full'>
				<h2 className='typography'>Pit Info</h2>
				<div className='mt-4'></div>
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
