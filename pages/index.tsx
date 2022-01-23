import Layout from '@/components/Layout';
import TeamDataTable from '@/components/TeamDataTable';
import { RouteHandler } from '@/lib/api/RouteHandler';
import fetcher from '@/lib/fetch';
import { mostCommonEndPos } from '@/lib/mode';
import connectDB from '@/middleware/connect-db';
import { RawTeamData, TeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';
import { CircularProgress } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import useSWR from 'swr';

export const getServerSideProps: GetServerSideProps<{ data: TeamData[] }> = async ({
	req,
	res,
}) => {
	const handler = new RouteHandler<'ssr', { result: TeamData[] }>({ ssr: true });

	try {
		await handler
			.use(connectDB)
			.get(async (req, res) => {
				const teams: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);
				teams.forEach((team) => {
					const commonEndPos = mostCommonEndPos(team.endPosition);
					(team as any).endPosition = commonEndPos;
				});
				req.result = teams as unknown as TeamData[];
			})
			.run(req, res);
	} catch (err: unknown) {
		console.error(err);
	}

	return {
		props: { data: (req as any).result },
	};
};

const Home: NextPage<{ data: TeamData[] }> = ({ data }) => {
	// const { data, error } = useSWR<TeamData[]>('/api/team-data', fetcher);

	// if (!data) {
	// 	return (
	// 		<Layout>
	// 			<CircularProgress />
	// 		</Layout>
	// 	);
	// }

	// if (error) {
	// 	return (
	// 		<Layout>
	// 			<h1>There was an error getting your data.</h1>
	// 		</Layout>
	// 	);
	// }

	return (
		<Layout>
			<h1>DATA</h1>
			<TeamDataTable data={data} />
		</Layout>
	);
};

export default Home;
