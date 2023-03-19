import { commonProps } from '@/lib/graphUtils';
import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Stack, Title, useMantineTheme } from '@mantine/core';
import { ScatterPlot } from '@nivo/scatterplot';

export const TeamTables = ({
	standForms,
	team,
	tableDefs,
}: {
	standForms: StandFormI[];
	team: TeamData;
	tableDefs: { dataFn: (form: StandFormI) => number; title: string }[];
}) => {
	const theme = useMantineTheme();
	const datas = tableDefs.map((def) => [
		{
			id: `Team ${team.teamNumber}`,
			title: def.title,
			data: standForms.map((form, i) => ({ x: i + 1, y: def.dataFn(form) })),
		},
	]);

	return (
		<>
			{datas.map((data) => (
				<Stack key={data[0].title}>
					<Title order={2}>{data[0].title}</Title>
					<ScatterPlot
						width={800}
						height={500}
						data={data}
						{...commonProps(theme.colorScheme === 'dark')}
					/>
				</Stack>
			))}
		</>
	);
};
