import Layout from '@/components/Layout';
import TeamDataTable from '@/components/TeamDataTable';
import fetcher from '@/lib/fetch';
import { TeamData } from '@/models/aggregations/teamData';
import { CircularProgress } from '@mui/material';
import { NextPage } from 'next';
import useSWR from 'swr';

const Home: NextPage<{ data: TeamData[] }> = () => {
	const { data, error } = useSWR<TeamData[]>('/api/team-data', fetcher);

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
				<h1>There was an error getting your data.</h1>
			</Layout>
		);
	}

	return (
		<Layout>
			<h1>Team Data</h1>
			<TeamDataTable data={data} />
		</Layout>
	);
};

export default Home;
