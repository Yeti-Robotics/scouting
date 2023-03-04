import { CompareTeam } from '@/components/Teams/CompareTeam';
import fetcher from '@/lib/fetch';
import { RawTeamData } from '@/models/aggregations/teamData';
import { Center, Group, Loader, Select, Stack, Text, Title } from '@mantine/core';
import { IconArrowsDiff } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';

const Compare = () => {
	const router = useRouter();
	const { data: rawTeams, error } = useSWR<RawTeamData[]>('/api/team-data', fetcher);
	const [team1Number, setTeam1Number] = useState<number | null>(
		parseInt(String(router.query.team1)) || null,
	);
	const [team2Number, setTeam2Number] = useState<number | null>();

	if (error)
		return (
			<Center>
				<Title>An error ocurred retrieving team data.</Title>
			</Center>
		);

	if (!rawTeams) return <Loader size='xl' />;

	const teamOptions = rawTeams.map(({ teamNumber }) => teamNumber.toString());
	const teams: Record<number, RawTeamData> = Object.fromEntries(
		rawTeams.map((team) => [team.teamNumber, team]),
	);

	const team1 = teams[team1Number ?? -1];
	const team2 = teams[team2Number ?? -1];

	return (
		<Stack align='center'>
			<Title>Select Teams</Title>
			<Group>
				<Select
					searchable
					label='Team 1'
					data={teamOptions.filter((t) => t !== team2Number?.toString())}
					value={team1Number?.toString() ?? null}
					clearable
					onChange={(v) => setTeam1Number(parseInt(v ?? '') || null)}
				/>
				<IconArrowsDiff />
				<Select
					searchable
					label='Team 2'
					data={teamOptions.filter((t) => t !== team1Number?.toString())}
					value={team2Number?.toString() ?? null}
					onChange={(v) => setTeam2Number(parseInt(v ?? '') || null)}
					clearable
				/>
			</Group>
			<Group align='center' position='center'>
				{team1 ? <CompareTeam team1={team1} team2={team2} /> : <Text>Select Team 1</Text>}
			</Group>
		</Stack>
	);
};

export default Compare;
