import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { ScheduleBlockI } from '@/models/ScheduleBlock';
import { Card, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import useSWR from 'swr';

const findTeam = (block: ScheduleBlockI, id: string) => {
	if (id === block.blue1?._id) return 'Blue 1';
	if (id === block.blue2?._id) return 'Blue 2';
	if (id === block.blue3?._id) return 'Blue 3';
	if (id === block.red1?._id) return 'Red 1';
	if (id === block.red2?._id) return 'Red 2';
	if (id === block.red3?._id) return 'Red 3';
	return 'This should not happen, if this happens please report it to Isaiah Gamble.';
};

const Home = () => {
	const { user } = useUser({ canRedirect: false });
	const { data, error } = useSWR<ScheduleBlockI[] | null>('/api/schedule/me', fetcher);

	if (data === undefined) {
		return <Loader />;
	}

	if (error) {
		return <h1>There was an error getting your data.</h1>;
	}

	if (data === null || !user) {
		// Not logged in ✊😔
		return (
			<Stack>
				<Title>Not wogged in 🥺</Title>
				<Text>If you're not on owe teem you don't need to 😁</Text>
			</Stack>
		);
	}

	return (
		<>
			<Title>Your Scouting Times</Title>
			<Group align='center' position='center'>
				{data.length > 0 ? (
					data.map((block) => {
						const team = findTeam(block, user._id);
						const isRed = team.includes('Red');
						return (
							<Card withBorder shadow='xl' key={block._id}>
								<Title order={5}>
									{new Date(block.startTime).toLocaleTimeString(undefined, {
										hour: '2-digit',
										minute: '2-digit',
										hour12: true,
									})}{' '}
									-{' '}
									{new Date(block.endTime).toLocaleTimeString(undefined, {
										hour: '2-digit',
										minute: '2-digit',
										hour12: true,
									})}
								</Title>
								<Paper bg={isRed ? 'red' : 'blue'} withBorder>
									<Text align='center' size='xl' fw={600}>
										{team}
									</Text>
								</Paper>
							</Card>
						);
					})
				) : (
					<Text size='xl'>Your not scouting (lucky 🙄)</Text>
				)}
			</Group>
		</>
	);
};

export default Home;
