import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Comments from '@/components/Teams/Comments';
import PitFormCard from '@/components/Teams/PitFormCard';
import StandFormCard from '@/components/Teams/StandFormCard';
import TeamStats from '@/components/Teams/TeamStats';
import fetcher from '@/lib/fetch';
import { toBase64 } from '@/lib/toBase64';
import { TeamData } from '@/models/aggregations/teamData';
import { PitFormI } from '@/models/PitForm';
import { PitImageRes } from '@/models/PitImage';
import { StandFormI } from '@/models/StandForm';
import { Box, Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const TeamPage = () => {
	const router = useRouter();
	const [images, setImages] = useState<PitImageRes[] | null>();
	const { data, error } = useSWR<{
		team?: TeamData;
		standForms: StandFormI[];
		pitForms: PitFormI[];
	}>(router.isReady ? `/api/team-data/${router.query.id}` : null, fetcher);

	useEffect(() => {
		if (!router.isReady) return;
		fetch(`/api/team-data/${router.query.id}/image-ids`).then(async (res) => {
			if (!res.ok) setImages(null);
			try {
				const ids: { _id: string }[] = await res.json();
				const images = await Promise.all(
					ids.map((id) =>
						fetch(`/api/team-data/${router.query.id}/image?imageId=${id._id}`),
					),
				);
				const imageJson: PitImageRes[] = await Promise.all(images.map((res) => res.json()));
				setImages(imageJson);
			} catch (e) {
				setImages(null);
			}
		});
	}, [router.isReady]);

	if (!data) {
		return <Loader size='xl' />;
	}

	if (error) {
		return <h1>There was an error getting your data :(</h1>;
	}

	if (!data.team) {
		return (
			<>
				<h1>No data found for team number {router.query.id}</h1>
			</>
		);
	}

	const { team, standForms, pitForms } = data;

	return (
		<>
			<h1>
				{team.teamNumber} {team.teamName}
			</h1>
			<TeamStats team={team} standForms={standForms} />
			<Comments forms={standForms} />
			<Section title='Stand Forms' expanded={Boolean(standForms[0])}>
				<Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
					{standForms.map((form) => (
						<StandFormCard key={form._id} team={team} form={form} />
					))}
				</Box>
			</Section>
			<Section title='Pit Forms' expanded={Boolean(pitForms[0])}>
				<Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
					{!pitForms[0] && <h2>No pit forms for this team.</h2>}
					{pitForms.map((form) => (
						<PitFormCard key={form._id} team={team} form={form} />
					))}
				</Box>
			</Section>
			<Section title='Pit Images' expanded={Boolean(images ? images[0] : images)}>
				<Box sx={{ display: 'flex', flexFlow: 'row wrap' }}>
					{images === undefined && <Loader size='xl' />}
					{images === null && <h2>There was an error getting images.</h2>}
					{images ? (
						!images[0] ? (
							<h2>No images found for this team.</h2>
						) : (
							images.map((image) => {
								return (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										key={image._id}
										src={`data:image/webp;base64,${toBase64(image.data.data)}`}
										alt='Pit Image'
										style={{
											flexGrow: 1,
											maxWidth: '300px',
											margin: '1rem',
											border: '2px solid darkGray',
										}}
									/>
								);
							})
						)
					) : null}
				</Box>
			</Section>
		</>
	);
};

export default TeamPage;
