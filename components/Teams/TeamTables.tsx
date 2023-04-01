import { commonProps } from '@/lib/graphUtils';
import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Title, useMantineTheme } from '@mantine/core';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

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
				<div key={data[0].title} style={{ width: '100%' }}>
					<Title order={2} align='center'>
						{data[0].title}
					</Title>
					<div style={{ height: 500, width: '100%' }}>
						<ResponsiveScatterPlot
							data={data}
							{...commonProps(theme.colorScheme === 'dark')}
						/>
					</div>
				</div>
			))}
		</>
	);
};
