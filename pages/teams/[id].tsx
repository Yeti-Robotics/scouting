import Layout from '@/components/Layout';
import Section from '@/components/Section';
import PitFormCard from '@/components/Teams/PitFormCard';
import StandFormCard from '@/components/Teams/StandFormCard';
import TeamStats from '@/components/Teams/TeamStats';
import fetcher from '@/lib/fetch';
import { toBase64 } from '@/lib/toBase64';
import { TeamData } from '@/models/aggregations/teamData';
import { PitFormI } from '@/models/PitForm';
import { PitImageRes } from '@/models/PitImage';
import { StandFormI } from '@/models/StandForm';
import { Box, CircularProgress } from '@mui/material';
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
		fetch(`/api/team-data/${router.query.id}/images`).then(async (res) => {
			if (!res.ok) setImages(null);
			const json = await res.json();
			setImages(json);
		});
	}, [router.isReady]);

	if (!data) {
		return (
			<Layout>
				<CircularProgress />
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<h1>{'There was an error getting your data :('}</h1>
			</Layout>
		);
	}

	if (!data.team) {
		return (
			<Layout>
				<h1>No data found for team number {router.query.id}</h1>
			</Layout>
		);
	}

	const { team, standForms, pitForms } = data;

	return (
		<Layout>
			<h1>
				{team.teamNumber} {team.teamName}
			</h1>
			<TeamStats team={team} />
			<Section title='Stand Forms' expanded={Boolean(standForms[0])}>
				<Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
					{standForms.map((form) => (
						<StandFormCard key={form._id} team={team} form={form} />
					))}
				</Box>
			</Section>
			<Section title='Pit Forms' expanded={Boolean(pitForms[0])}>
				<Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
					{pitForms.map((form) => (
						<PitFormCard key={form._id} team={team} form={form} />
					))}
				</Box>
			</Section>
			<Section title='Pit Images' expanded={Boolean(images ? images[0] : images)}>
				{images === undefined && <CircularProgress />}
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
									src={`data:image/*;base64,${toBase64(image.data.data)}`}
									alt='Pit Image'
									width={300}
								/>
							);
						})
					)
				) : null}
			</Section>
		</Layout>
	);
};

export default TeamPage;
