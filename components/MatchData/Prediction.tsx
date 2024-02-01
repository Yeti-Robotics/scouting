import { MatchTeamData, useMatchTeamData } from './useMatchTeamData';
import { Card, Center, Group, Loader, Stack, Title } from '@mantine/core';
import { RawTeamData } from '@/models/aggregations/teamData';
import { MatchI } from '@/models/Match';

const filterTeams = (teams: (RawTeamData | undefined)[]) =>
	teams.filter((team) => team) as RawTeamData[];

const calcAvgAutoPieceScore = (teamData: RawTeamData) => {
	return (
		teamData.avgAutoAmpNotes * 2 +
		teamData.avgAutoSpeakerNotes * 5
	);
};

const calcAvgTeleopPieceScore = (teamData: RawTeamData) => {
	return (
		teamData.avgTeleopAmpNotes * 1 +
		teamData.avgTeleopSpeakerNotes * 2 +
		teamData.avgTeleopAmplifiedSpeakerNotes * 5
	);
};


const calcPredictedMatchScores = (matchTeamData: MatchTeamData) => {
	const blues = filterTeams([matchTeamData.blue1, matchTeamData.blue2, matchTeamData.blue3]);
	const reds = filterTeams([matchTeamData.red1, matchTeamData.red2, matchTeamData.red3]);

	const blueAuto = blues.map(calcAvgAutoPieceScore).reduce((acc, v) => acc + v, 0);
	const redAuto = reds.map(calcAvgAutoPieceScore).reduce((acc, v) => acc + v, 0);

	const blueTeleop = blues.map(calcAvgTeleopPieceScore).reduce((acc, v) => acc + v, 0);
	const redTeleop = reds.map(calcAvgTeleopPieceScore).reduce((acc, v) => acc + v, 0);

	return {
		blue: {
			auto: blueAuto,
			teleop: blueTeleop,
		},
		red: {
			auto: redAuto,
			teleop: redTeleop,
		},
	};
};

const TeamPrediction = ({
	color,
	prediction,
	teams,
}: {
	color: 'blue' | 'red';
	prediction: { auto: number; teleop: number};
	teams: (RawTeamData | undefined)[];
}) => {
	const teamNumbers = teams
		.filter((team) => team)
		.map((team) => team?.teamNumber)
		.join(', ');
	return (
		<Card p='md' withBorder shadow='xl' bg={color} sx={{ color: 'white' }}>
			<Stack h='100%' align='end'>
				<Title sx={{ flexGrow: 1 }}>{color === 'blue' ? 'Blue' : 'Red'}</Title>
				{teamNumbers.length > 0 ? <Title order={3}>{teamNumbers}</Title> : <></>}
				<Title order={4}>Auto: {Math.round(prediction.auto)}</Title>
				<Title order={4}>Teleop: {Math.round(prediction.teleop)}</Title>
				<Title order={2}>
					Total:{' '}
					{Math.round(
						prediction.auto +
							prediction.teleop
					)}
				</Title>
			</Stack>
		</Card>
	);
};

export const Prediction = ({ match }: { match: MatchI }) => {
	const data = useMatchTeamData(match._id);

	if (!data)
		return (
			<Center>
				<Loader size='xl' />
			</Center>
		);

	const noData =
		!data.blue1 && !data.blue2 && !data.blue3 && !data.red1 && !data.red2 && !data.red3;

	const predictions = calcPredictedMatchScores(data);
	console.log(predictions);

	return (
		<div>
			{noData ? (
				<Title>No data on any of the teams.</Title>
			) : (
				<Group align='flex' position='center'>
					<TeamPrediction
						color='red'
						prediction={predictions.red}
						teams={[data.red1, data.red2, data.red3]}
					/>
					<Title sx={{ alignSelf: 'center' }}>Vs.</Title>
					<TeamPrediction
						color='blue'
						prediction={predictions.blue}
						teams={[data.blue1, data.blue2, data.blue3]}
					/>
				</Group>
			)}
		</div>
	);
};
