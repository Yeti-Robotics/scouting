import fetcher from '@/lib/fetch';
import { RawTeamData } from '@/models/aggregations/teamData';
import { ScatterPlot, ScatterPlotRawSerie, ScatterPlotSvgProps } from '@nivo/scatterplot';
import useSWR from 'swr';
import { Group, Loader, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { StandFormI } from '@/models/StandForm';

type Props = {
	team1: RawTeamData;
	team2: RawTeamData | undefined;
};

const calcAutoScore = (form: StandFormI) =>
	form.autoTopCones * 6 +
	form.autoTopCubes * 6 +
	form.autoMidCones * 4 +
	form.autoMidCubes * 4 +
	form.autoLowCones * 3 +
	form.autoLowCubes * 3;

const calcTeleopScore = (form: StandFormI) =>
	form.teleopTopCones * 5 +
	form.teleopTopCubes * 5 +
	form.teleopMidCones * 3 +
	form.teleopMidCubes * 3 +
	form.teleopLowCones * 2 +
	form.teleopLowCubes * 2;

const calcBalancePercentage = (forms: StandFormI[]) =>
	(
		(forms.reduce((acc, form) => (form.autoEngaged ? (acc += 1) : acc), 0) /
			(forms.length || 1)) *
		100
	).toFixed(1);

const commonProps = (
	isDarkMode: boolean,
): Omit<ScatterPlotSvgProps<any>, 'data' | 'height' | 'width'> => ({
	theme: {
		textColor: isDarkMode ? 'white' : 'black',
	},
	colors: {
		scheme: isDarkMode ? 'set1' : 'set1',
	},
	margin: { top: 16, right: 140, bottom: 70, left: 90 },
	xScale: { type: 'linear', min: 1, max: 'auto' },
	xFormat: '>-.2f',
	yScale: { type: 'linear', min: 0, max: 'auto' },
	yFormat: '>-.2f',
	axisTop: null,
	axisRight: null,
	axisBottom: {
		tickSize: 5,
		tickPadding: 5,
		tickRotation: 0,
		legend: 'nth match',
		legendPosition: 'middle',
		legendOffset: 46,
	},
	axisLeft: {
		tickSize: 5,
		tickPadding: 5,
		tickRotation: 0,
		legend: 'points scored',
		legendPosition: 'middle',
		legendOffset: -60,
	},
	legends: [
		{
			anchor: 'bottom-right',
			direction: 'column',
			justify: false,
			translateX: 130,
			translateY: 0,
			itemWidth: 100,
			itemHeight: 12,
			itemsSpacing: 5,
			itemDirection: 'left-to-right',
			symbolSize: 12,
			symbolShape: 'circle',
			effects: [
				{
					on: 'hover',
					style: {
						itemOpacity: 1,
					},
				},
			],
		},
	],
});

export const CompareTeam = ({ team1, team2 }: Props) => {
	const theme = useMantineTheme();
	const isDarkMode = theme.colorScheme === 'dark';
	const { data: team1Forms } = useSWR<StandFormI[]>(
		`/api/team-data/${team1.teamNumber}/stand-forms`,
		fetcher,
	);
	const { data: team2Forms } = useSWR<StandFormI[]>(
		team2 ? `/api/team-data/${team2.teamNumber}/stand-forms` : null,
		fetcher,
	);

	if (!team1Forms) return <Loader size='xl' />;

	const autoData: ScatterPlotRawSerie<{ x: number; y: number }>[] = [
		{
			id: `Team ${team1.teamNumber}`,
			data: team1Forms.map((form, i) => ({ x: i + 1, y: calcAutoScore(form) })),
		},
	];

	const teleopData: ScatterPlotRawSerie<{ x: number; y: number }>[] = [
		{
			id: `Team ${team1.teamNumber}`,
			data: team1Forms.map((form, i) => ({ x: i + 1, y: calcTeleopScore(form) })),
		},
	];

	if (team2 && team2Forms) {
		autoData.push({
			id: `Team ${team2.teamNumber}`,
			data: team2Forms.map((form, i) => ({ x: i + 1, y: calcAutoScore(form) })),
		});

		teleopData.push({
			id: `Team ${team2.teamNumber}`,
			data: team2Forms.map((form, i) => ({ x: i + 1, y: calcTeleopScore(form) })),
		});
	}

	return (
		<Stack align='center'>
			{team2 && !team2Forms && (
				<Group align='center' position='center'>
					<Loader size='xl' />
					<Text>Loading in {team2.teamNumber}'s data</Text>
				</Group>
			)}
			<Title>
				{team1.teamNumber} {team1.teamName ? `: ${team1.teamName}` : ''}
				{team2 && ` Vs. ${team2.teamNumber} ${team2.teamName ? `: ${team2.teamName}` : ''}`}
			</Title>
			<Title order={2}>Auto Scores</Title>
			<ScatterPlot width={800} height={500} data={autoData} {...commonProps(isDarkMode)} />
			<Title order={2}>Teleop Scores</Title>
			<ScatterPlot width={800} height={500} data={teleopData} {...commonProps(isDarkMode)} />
			<Title order={2}>Auto Balance %</Title>
			<Group align='center' position='center'>
				<Title order={3}>
					{team1.teamNumber}: {calcBalancePercentage(team1Forms)}%
				</Title>
				{team2 && team2Forms && (
					<Title order={3}>
						{team2.teamNumber}
						{calcBalancePercentage(team2Forms)}%
					</Title>
				)}
			</Group>
		</Stack>
	);
};
