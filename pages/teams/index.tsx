import { TeamDataTable } from '@/components/TeamDataTable';
import fetcher from '@/lib/fetch';
import { RawTeamData } from '@/models/aggregations/teamData';
import { Loader } from '@mantine/core';
import useSWR from 'swr';

const Teams = () => {
	const { data } = useSWR<RawTeamData[]>('/api/team-data', fetcher);

	if (!data) return <Loader size='xl' />;

	return (
		<div>
			<TeamDataTable data={data} />
		</div>
	);
};

export default Teams;
