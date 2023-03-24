import { MatchData } from '@/models/aggregations/matchData';
import { Title, useMantineTheme } from '@mantine/core';
import { getTitle, selectScoreKey } from '@/lib/matchDataUtils';
import { ResponsiveBar } from '@nivo/bar';

interface Props {
	match: MatchData;
	auto: boolean;
	level: 'top' | 'mid' | 'low';
	piece: 'cone' | 'cube';
}

const teamKeys = ['blue1', 'blue2', 'blue3', 'red1', 'red2', 'red3'] as const;

export const ScoringGraph = ({ match, auto, piece, level }: Props) => {
	const theme = useMantineTheme();
	const isDarkMode = theme.colorScheme === 'dark';
	const scoreKey = selectScoreKey({ auto, piece, level });
	const data: { teamNumber: number; [key: string]: string | number }[] = [];
	let numNonZero = 0;

	teamKeys.forEach((teamKey) => {
		const form = match[teamKey];
		if (form) {
			if (form[scoreKey] !== 0) numNonZero += 1;
			data.push({
				teamNumber: form.teamNumber,
				teamName: form.teamName,
				[scoreKey]: form[scoreKey],
			});
		}
	});

	return (
		<>
			<Title order={3} mt='md'>
				{getTitle({ auto, piece, level })}
			</Title>
			{numNonZero <= 0 && (
				<Title order={4} align='center'>
					No One Scored Any 💀
				</Title>
			)}
			{numNonZero > 0 && (
				<div style={{ height: 400 }}>
					<ResponsiveBar
						data={data}
						keys={[scoreKey]}
						indexBy='teamNumber'
						margin={{ top: 50, right: 30, bottom: 60, left: 80 }}
						padding={0.3}
						valueScale={{ type: 'linear' }}
						indexScale={{ type: 'band', round: true }}
						axisTop={null}
						axisRight={null}
						theme={{
							textColor: isDarkMode ? 'white' : 'black',
							fontSize: 16,
						}}
						colors={theme.colors[theme.primaryColor][6]}
						axisBottom={{
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							legend: 'Team',
							legendPosition: 'middle',
							legendOffset: 48,
						}}
						axisLeft={{
							tickRotation: 0,
							legend: 'Pieces Scored',
							legendPosition: 'middle',
							legendOffset: -60,
						}}
						borderColor={{
							from: 'color',
							modifiers: [['darker', 1.6]],
						}}
						labelTextColor={{
							from: 'custom',
							modifiers: [['darker', 3]],
						}}
						labelSkipWidth={16}
						labelSkipHeight={16}
						role='application'
						barAriaLabel={(e) => {
							return e.id + ': ' + e.formattedValue + ' ' + e.indexValue;
						}}
					/>
				</div>
			)}
		</>
	);
};

export default ScoringGraph;
