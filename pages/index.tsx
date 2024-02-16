import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { ScheduleBlockI } from '@/models/ScheduleBlock';
import { Card, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import useSWR from 'swr';

const findTeam = (block: ScheduleBlockI, id: string) => {
	if (id === block.blue1a?._id) return 'Blue 1';
	if (id === block.blue1b?._id) return 'Blue 1';
	if (id === block.blue2a?._id) return 'Blue 2';
	if (id === block.blue2b?._id) return 'Blue 2';
	if (id === block.blue3a?._id) return 'Blue 3';
	if (id === block.blue3b?._id) return 'Blue 3';
	if (id === block.red1a?._id) return 'Red 1';
	if (id === block.red1b?._id) return 'Red 1';
	if (id === block.red2a?._id) return 'Red 2';
	if (id === block.red2b?._id) return 'Red 2';
	if (id === block.red3a?._id) return 'Red 3';
	if (id === block.red3b?._id) return 'Red 3';
	return 'This should not happen, if this happens please report it to Isaiah Gamble.';
};

const Home = () => {
	const { user } = useUser({ canRedirect: false });
	const { data, error } = useSWR<ScheduleBlockI[] | null>('/api/schedule/me', fetcher);

	if (data === undefined) return <Loader />;

	if (error) {
		return <h1>There was an error getting your data.</h1>;
	}

	if (data === null || !user) {
		// Not logged in ✊😔
		return (
			<Stack align='center' justify='center'>
				<Title align='center'>Not wogged in 🥺</Title>
				<Text align='center'>If you're not on owe teem you don't need to 😁</Text>
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
								<Stack align='center' spacing={0}>
									<Title order={5}>Matches</Title>
									<Title order={5}>
										{block.startMatch} - {block.lastMatch}
									</Title>
									<Paper p={4} bg={isRed ? 'red' : 'blue'}>
										<Text align='center' size='xl' fw={600}>
											{team}
										</Text>
									</Paper>
								</Stack>
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
