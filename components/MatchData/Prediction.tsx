import fetcher from '@/lib/fetch';
import useSWRImmutable from 'swr/immutable';
import { MatchTeamData, useMatchTeamData } from './useMatchTeamData';
import { Card, Center, Group, Loader, Stack, Title } from '@mantine/core';
import { RawTeamData } from '@/models/aggregations/teamData';

const filterTeams = (teams: (RawTeamData | undefined)[]) =>
	teams.filter((team) => team) as RawTeamData[];

const calcAvgAutoPieceScore = (teamData: RawTeamData) => {
	return (
		teamData.avgAutoTopCones * 6 +
		teamData.avgAutoMidCones * 4 +
		teamData.avgAutoLowCones * 3 +
		teamData.avgAutoTopCubes * 6 +
		teamData.avgAutoMidCubes * 4 +
		teamData.avgAutoLowCubes * 3
	);
};

const calcAvgTeleopPieceScore = (teamData: RawTeamData) => {
	return (
		teamData.avgTeleopTopCones * 5 +
		teamData.avgTeleopMidCones * 3 +
		teamData.avgTeleopLowCones * 2 +
		teamData.avgTeleopTopCubes * 5 +
		teamData.avgTeleopMidCubes * 3 +
		teamData.avgTeleopLowCubes * 2
	);
};

const calcAvgEndChargerPoints = (teams: RawTeamData[]) => {
	// Boffa these might be NaN
	const avgDocked =
		teams.map((team) => team.avgRobotsDocked * 6).reduce((acc, v) => acc + v, 0) / teams.length;
	const avgEngaged =
		teams.map((team) => team.avgRobotsEngaged * 10).reduce((acc, v) => acc + v, 0) /
		teams.length;
	return ((avgDocked || 0) + (avgEngaged || 0)) / 2;
};

const calcAvgAutoChargerPoints = (teams: RawTeamData[]) => {
	// percent is in x% not 0.xx
	const highestAutoEngagePercent = Math.max(...teams.map((team) => team?.autoEngagePercent ?? 0));
	const avgAutoEngage =
		highestAutoEngagePercent === -Infinity ? 0 : (highestAutoEngagePercent / 100) * 12;
	return avgAutoEngage;
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
			autoCharger: calcAvgAutoChargerPoints(blues),
			teleop: blueTeleop,
			teleopCharger: calcAvgEndChargerPoints(blues),
		},
		red: {
			auto: redAuto,
			autoCharger: calcAvgAutoChargerPoints(reds),
			teleop: redTeleop,
			teleopCharger: calcAvgEndChargerPoints(reds),
		},
	};
};

const TeamPrediction = ({
	color,
	prediction,
	teams,
}: {
	color: 'blue' | 'red';
	prediction: { auto: number; autoCharger: number; teleop: number; teleopCharger: number };
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
				<Title order={4}>Auto Charger: {Math.round(prediction.autoCharger)}</Title>
				<Title order={4}>Teleop: {Math.round(prediction.teleop)}</Title>
				<Title order={4}>End Charger: {Math.round(prediction.teleopCharger)}</Title>
				<Title order={2}>
					Total:{' '}
					{Math.round(
						prediction.auto +
							prediction.autoCharger +
							prediction.teleop +
							prediction.teleopCharger,
					)}
				</Title>
			</Stack>
		</Card>
	);
};

export const Prediction = ({ matchNumber }: { matchNumber: number }) => {
	const { data: id } = useSWRImmutable<string>(
		`/api/matches/num-to-id?number=${matchNumber}`,
		fetcher,
	);
	const data = useMatchTeamData(id);

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
