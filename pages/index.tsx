import Layout from '@/components/Layout';
import TeamDataTable from '@/components/TeamDataTable';
import fetcher from '@/lib/fetch';
import { TeamData } from '@/models/aggregations/teamData';
import { CircularProgress } from '@mui/material';
import type { NextPage } from 'next';
import useSWR from 'swr';

const Home: NextPage = () => {
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
			<h1>data</h1>
			<TeamDataTable data={data} />
		</Layout>
	);
};

export default Home;
