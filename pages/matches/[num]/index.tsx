import { Center, Loader, Paper, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { Data } from '@/components/MatchData/Data';
import { useLocalStorage } from '@mantine/hooks';
import { Capabilities } from '@/components/MatchData/Capabilities';
import { Prediction } from '@/components/MatchData/Prediction';

const Match = () => {
	const [activeTab, setActiveTab] = useLocalStorage<string | null>({
		key: 'matchTab',
		defaultValue: 'data',
	});
	const router = useRouter();

	return (
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
				{router.isReady ? (
					<Capabilities matchNumber={Number(router.query.num)} />
				) : (
					<Center>
						<Loader size='xl' />
					</Center>
				)}
			</Tabs.Panel>
			<Tabs.Panel value='prediction' p='md'>
				{router.isReady ? (
					<Prediction matchNumber={Number(router.query.num)} />
				) : (
					<Center>
						<Loader size='xl' />
					</Center>
				)}
			</Tabs.Panel>
		</Tabs>
	);
};

export default Match;
