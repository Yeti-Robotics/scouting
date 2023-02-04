import fetcher from '@/lib/fetch';
import { TeamData } from '@/models/aggregations/teamData';
import { Loader } from '@mantine/core';
import { NextPage } from 'next';
import useSWR from 'swr';

const Home: NextPage<{ data: TeamData[] }> = () => {
	const { data, error } = useSWR<TeamData[]>('/api/team-data', fetcher);

	if (!data) {
		return <Loader />;
	}

	if (error) {
		return <h1>There was an error getting your data.</h1>;
	}

	return (
		<>
			<h1>Team Data</h1>
		</>
	);
};

export default Home;
