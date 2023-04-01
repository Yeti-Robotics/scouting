import fetcher from '@/lib/fetch';
import { MatchWPit } from '@/models/aggregations/matchWPit';
import { RawTeamData } from '@/models/aggregations/teamData';
import { MatchI } from '@/models/Match';
import { PitFormI } from '@/models/PitForm';
import { Card, Center, Group, Loader, Text, Title } from '@mantine/core';
import { useMemo } from 'react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { Cone, Cube } from '../icons';

type MatchTeamData = {
	blue1?: RawTeamData;
	blue2?: RawTeamData;
	blue3?: RawTeamData;
	red1?: RawTeamData;
	red2?: RawTeamData;
	red3?: RawTeamData;
};

const TeamCapabilities = ({
	teamNumber,
	color,
	data,
}: {
	teamNumber: number;
	color: 'red' | 'blue';
	data?: RawTeamData;
}) => {
	if (!data)
		return (
			<Card withBorder shadow='md' bg={color} sx={{ color: 'white' }}>
				No data for {teamNumber}
			</Card>
		);

	// If they avg less than 0.2 it dont count
	const noCone = data.avgTopCones <= 0.2 && data.avgMidCones <= 0.2;
	const noCube = data.avgTopCubes <= 0.2 && data.avgMidCubes <= 0.2;

	return (
		<Card withBorder shadow='md' bg={color} sx={{ color: 'white' }}>
			<Title order={3} align='center'>
				{teamNumber}
			</Title>
			<Title align='center' order={5}>
				<Cone height={24} width={24} /> Cones
			</Title>
			{noCone ? (
				<Text align='center'>Only Low</Text>
			) : (
				<>
					{data.avgTopCones >= 0.2 && <Text align='center'>Top</Text>}
					{data.avgMidCones >= 0.2 && <Text align='center'>Mid</Text>}
				</>
			)}
			<Title align='center' pt='md' order={5}>
				<Cube height={24} width={24} /> Cubes
			</Title>
			{noCube ? (
				<Text align='center'>Only Low</Text>
			) : (
				<>
					{data.avgTopCubes >= 0.2 && <Text align='center'>Top</Text>}
					{data.avgMidCubes >= 0.2 && <Text align='center'>Mid</Text>}
				</>
			)}
			<Title pt='md' align='center' order={5}>
				Auto
			</Title>
			<Text align='center'>Dock: {data.autoDockPercent?.toFixed(2) ?? 0}%</Text>
			<Text align='center'>Engage: {data.autoEngagePercent?.toFixed(2) ?? 0}%</Text>
		</Card>
	);
};

const TeamPitCapabilities = ({
	teamNumber,
	color,
	form,
}: {
	teamNumber: number;
	color: 'red' | 'blue';
	form?: PitFormI;
}) => {
	if (!form) return <></>;

	const cubes = form.whereScore.filter((position) => position.includes('Cubes'));
	const cones = form.whereScore.filter((position) => position.includes('Cone'));

	return (
		<Card withBorder shadow='md' bg={color} sx={{ color: 'white' }}>
			<Title order={3} align='center'>
				{teamNumber}
			</Title>
			<Title order={5}>
				<Cone height={24} width={24} /> Cones
			</Title>
			{cones.length === 0 ? (
				<Text align='center'>They can't</Text>
			) : (
				cones.map((pos) => (
					<Text align='center' key={pos}>
						{pos.replace('Cones ', '')}
					</Text>
				))
			)}
			<Title pt='md' order={5}>
				<Cube height={24} width={24} /> Cubes
			</Title>
			{cubes.length === 0 ? (
				<Text align='center'>They can't</Text>
			) : (
				cubes.map((pos) => (
					<Text align='center' key={pos}>
						{pos.replace('Cubes', '')}
					</Text>
				))
			)}
			<Title pt='md' align='center' order={5}>
				Auto
			</Title>
			<Text align='center'>{form.autoBalance ? 'Can Balance' : "Can't balance"}</Text>
		</Card>
	);
};

export const Capabilities = ({ matchNumber }: { matchNumber: number }) => {
	const { data: id } = useSWRImmutable<string>(
		`/api/matches/num-to-id?number=${matchNumber}`,
		fetcher,
	);
	const { data: match } = useSWR<MatchI>(id ? `/api/matches/${id}` : null, fetcher);
	const { data: pitForms } = useSWR<MatchWPit>(
		id ? `/api/matches/${id}/pit-forms` : null,
		fetcher,
	);
	const { data: teamData } = useSWR<RawTeamData[]>(id ? `/api/team-data` : null, fetcher);

	const data = useMemo(
		() =>
			teamData && match
				? teamData.reduce<MatchTeamData>((acc, team) => {
						if (match.blue1 === team.teamNumber) {
							acc.blue1 = team;
						} else if (match.blue2 === team.teamNumber) {
							acc.blue2 = team;
						} else if (match.blue3 === team.teamNumber) {
							acc.blue3 = team;
						} else if (match.red1 === team.teamNumber) {
							acc.red1 = team;
						} else if (match.red2 === team.teamNumber) {
							acc.red2 = team;
						} else if (match.red3 === team.teamNumber) {
							acc.red3 = team;
						}

						return acc;
				  }, {})
				: null,
		[teamData, match],
	);

	if (!match || !pitForms || !teamData)
		return (
			<Center>
				<Loader size='xl' />
			</Center>
		);

	const noPitForms =
		!pitForms.blue1 &&
		!pitForms.blue2 &&
		!pitForms.blue3 &&
		!pitForms.red1 &&
		!pitForms.red2 &&
		!pitForms.red3;

	// This should be impossible
	if (!data) throw new Error('React sus rn');

	const noData =
		!data.blue1 && !data.blue2 && !data.blue3 && !data.red1 && !data.red2 && !data.red3;

	return (
		<div>
			{noData ? (
				<Title>No stand forms for any of these teams</Title>
			) : (
				<>
					<Title align='center'>Scouted Data</Title>
					<Group align='center' position='center'>
						{match.blue1 !== undefined && (
							<TeamCapabilities
								teamNumber={match.blue1}
								color='blue'
								data={data.blue1}
							/>
						)}
						{match.blue2 !== undefined && (
							<TeamCapabilities
								teamNumber={match.blue2}
								color='blue'
								data={data.blue2}
							/>
						)}
						{match.blue3 !== undefined && (
							<TeamCapabilities
								teamNumber={match.blue3}
								color='blue'
								data={data.blue3}
							/>
						)}

						{match.red1 !== undefined && (
							<TeamCapabilities
								teamNumber={match.red1}
								color='red'
								data={data.red1}
							/>
						)}
						{match.red2 !== undefined && (
							<TeamCapabilities
								teamNumber={match.red2}
								color='red'
								data={data.red2}
							/>
						)}
						{match.red3 !== undefined && (
							<TeamCapabilities
								teamNumber={match.red3}
								color='red'
								data={data.red3}
							/>
						)}
					</Group>
					<Text align='center'>
						Average must be at least 0.2 pieces in that spot per match to be considered
						as capable, all robots are capable of low scoring
					</Text>
				</>
			)}
			{noPitForms ? (
				<Title align='center' pt='md'>
					No pit forms for any of these teams
				</Title>
			) : (
				<>
					<Title align='center' pt='md'>
						Pit Data
					</Title>
					<Group align='center' position='center'>
						{match.blue1 !== undefined && (
							<TeamPitCapabilities
								teamNumber={match.blue1}
								color='blue'
								form={pitForms.blue1}
							/>
						)}
						{match.blue2 !== undefined && (
							<TeamPitCapabilities
								teamNumber={match.blue2}
								color='blue'
								form={pitForms.blue2}
							/>
						)}
						{match.blue3 !== undefined && (
							<TeamPitCapabilities
								teamNumber={match.blue3}
								color='blue'
								form={pitForms.blue3}
							/>
						)}

						{match.red1 !== undefined && (
							<TeamPitCapabilities
								teamNumber={match.red1}
								color='red'
								form={pitForms.red1}
							/>
						)}
						{match.red2 !== undefined && (
							<TeamPitCapabilities
								teamNumber={match.red2}
								color='red'
								form={pitForms.red2}
							/>
						)}
						{match.red3 !== undefined && (
							<TeamPitCapabilities
								teamNumber={match.red3}
								color='red'
								form={pitForms.red3}
							/>
						)}
					</Group>
					<Text align='center'>
						If a team doesn't appear here, it means we have no pit form for them.
					</Text>
				</>
			)}
		</div>
	);
};
