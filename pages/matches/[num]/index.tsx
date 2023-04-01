import {
	ActionIcon,
	Box,
	Center,
	Group,
	Loader,
	Paper,
	Tabs,
	Text,
	Title,
	useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { Data } from '@/components/MatchData/Data';
import { useLocalStorage } from '@mantine/hooks';
import { Capabilities } from '@/components/MatchData/Capabilities';
import { Prediction } from '@/components/MatchData/Prediction';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import fetcher from '@/lib/fetch';
import { MatchI } from '@/models/Match';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const Match = () => {
	const router = useRouter();
	const theme = useMantineTheme();
	const [activeTab, setActiveTab] = useLocalStorage<string | null>({
		key: 'matchTab',
		defaultValue: 'data',
	});
	const { data: id } = useSWRImmutable<string>(
		router.isReady ? `/api/matches/num-to-id?number=${router.query.num}` : null,
		fetcher,
	);
	const { data: match } = useSWR<MatchI>(id ? `/api/matches/${id}` : null, fetcher);
	const { data: matchNumMap } = useSWR<Record<number, boolean>>('/api/matches/numbers', fetcher);

	return (
		<Box w='100%'>
			{router.isReady ? (
				<Title align='center' pb='md'>
					Match {router.query.num}
				</Title>
			) : null}
			<Tabs value={activeTab} onTabChange={setActiveTab} w='100%'>
				<Paper sx={{ position: 'sticky', top: 48, zIndex: 1 }}>
					<Tabs.List grow>
						<Tabs.Tab value='data' fz='md' fw={600}>
							Data
						</Tabs.Tab>
						<Tabs.Tab value='capabilities' fz='md' fw={600}>
							Capabilities
						</Tabs.Tab>
						<Tabs.Tab value='prediction' fz='md' fw={600}>
							Prediction
						</Tabs.Tab>
					</Tabs.List>
				</Paper>

				<Tabs.Panel value='data' p='md'>
					{router.isReady ? (
						<Data matchNumber={Number(router.query.num)} />
					) : (
						<Center>
							<Loader size='xl' />
						</Center>
					)}
				</Tabs.Panel>
				<Tabs.Panel value='capabilities' p='md'>
					{match ? (
						<Capabilities match={match} />
					) : (
						<Center>
							<Loader size='xl' />
						</Center>
					)}
				</Tabs.Panel>
				<Tabs.Panel value='prediction' p='md'>
					{match ? (
						<Prediction match={match} />
					) : (
						<Center>
							<Loader size='xl' />
						</Center>
					)}
				</Tabs.Panel>
			</Tabs>
			<Group sx={{ position: 'sticky', bottom: '2rem' }} position='center'>
				<Group w='100%' maw={300} position='apart'>
					<ActionIcon
						loading={!matchNumMap}
						disabled={match && matchNumMap && !matchNumMap[match.matchNumber - 1]}
						onClick={() => match && router.push(`/matches/${match.matchNumber - 1}`)}
						variant='default'
						size='xl'
					>
						<IconChevronLeft />
					</ActionIcon>
					{match && (
						<Text color={theme.primaryColor} fw={700} size='xl'>
							Match {match.matchNumber}
						</Text>
					)}
					<ActionIcon
						loading={!matchNumMap}
						disabled={match && matchNumMap && !matchNumMap[match.matchNumber + 1]}
						onClick={() => match && router.push(`/matches/${match.matchNumber + 1}`)}
						variant='default'
						size='xl'
					>
						<IconChevronRight />
					</ActionIcon>
				</Group>
			</Group>
		</Box>
	);
};

export default Match;
