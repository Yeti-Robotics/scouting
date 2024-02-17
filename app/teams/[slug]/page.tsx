import PitForm from '@/models/PitForm';
import PitImage from '@/models/PitImage';
import StandForm from '@/models/StandForm';
import Image from 'next/image';
import { toBase64 } from '@/lib/toBase64';
import { connectToDbB } from '@/middleware/connect-db';
import { RawTeamData } from '@/models/aggregations/teamData';
import { teamDataAggregation } from '@/models/aggregations/teamData';

async function getTeamData(teamNumber: number) {
	await connectToDbB();
	const data: RawTeamData[] = await StandForm.aggregate<RawTeamData>([
		...teamDataAggregation,
		{ $match: { teamNumber: teamNumber } },
	]);
	const standForms = await StandForm.find({ teamNumber: teamNumber }).sort({
		matchNumber: 1,
	});
	const pitForms = await PitForm.find({ teamNumber: teamNumber });
	const pitImages = await PitImage.find({ teamNumber: teamNumber });

	return { team: data[0], standForms, pitForms, pitImages };
}

export default async function TeamPage({ params }: { params: { slug: string } }) {
	const teamNumber = parseInt(params.slug);
	if (isNaN(teamNumber)) {
		return <div>Invalid team number.</div>;
	}
	const teamData = await getTeamData(teamNumber);
	if (!teamData.team) return <div>Not Found</div>;

	return (
		<main className='container mt-8 w-full'>
			<h1 className='typography mb-6 break-words'>
				{teamData.team.teamNumber} | {teamData.team.teamName}
			</h1>
			<section className='w-full'>
				<div>
					<h2 className='typography'>Robot Images</h2>
					{!teamData.pitImages || !teamData.pitImages[0] ? (
						<p className='lead'>No images found for this team.</p>
					) : (
						<div className='mt-4 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4'>
							{teamData.pitImages.map((image) => {
								return (
									// eslint-disable-next-line @next/next/no-img-element
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
