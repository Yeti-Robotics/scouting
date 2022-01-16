import Layout from '@/components/Layout';
import Section from '@/components/Section';
import StandFormCard from '@/components/Teams/StandFormCard';
import TeamStats from '@/components/Teams/TeamStats';
import fetcher from '@/lib/fetch';
import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const TeamPage = () => {
	const router = useRouter();
	const { data, error } = useSWR<{ team?: TeamData; standForms: StandFormI[] }>(
		router.isReady ? `/api/team-data/${router.query.id}` : null,
		fetcher,
	);

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
	const { team, standForms } = data;

	return (
		<Layout>
			<h1>
				{team.teamNumber} {team.teamName}
			</h1>
			<TeamStats team={team} />
			<Section title='Stand Forms'>
				<Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
					{standForms.map((form) => (
						<StandFormCard key={form._id} team={team} form={form} />
					))}
				</Box>
			</Section>
		</Layout>
	);
};

export default TeamPage;
