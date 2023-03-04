import fetcher from '@/lib/fetch';
import { RawTeamData } from '@/models/aggregations/teamData';
import { MatchI } from '@/models/Match';
import { ResponsiveScatterPlot, ScatterPlotRawSerie } from '@nivo/scatterplot';
import {} from '@nivo/core';
import useSWR from 'swr';
import { Loader, Stack } from '@mantine/core';

type Props = {
	team: RawTeamData;
};

export const CompareTeam = ({ team }: Props) => {
	const { data: matches } = useSWR<MatchI[]>(
		`/api/team-data/${team.teamNumber}/matches`,
		fetcher,
	);

	if (!matches) return <Loader size='xl' />;

	const avgAutoData: ScatterPlotRawSerie<{ x: number; y: number }>[] = [
		{ id: `Team ${team.teamNumber}`, data: [] },
	];

	return (
		<Stack>
			<ResponsiveScatterPlot data={avgAutoData} />
		</Stack>
	);
};
