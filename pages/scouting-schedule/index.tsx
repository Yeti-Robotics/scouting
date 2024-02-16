import { Link } from '@/components/Link';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { ScheduleBlockI } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { Card, Divider, Group, Loader, Stack, Text } from '@mantine/core';
import { Button, Checkbox } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import useSWR from 'swr';

const BlockDisplay = ({ user, block }: { block: ScheduleBlockI; user: UserI }) => {
	return (
		<Card
			withBorder
			shadow='md'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				alignItems: 'center',
			}}
		>
			<h2 style={{ margin: 0 }}>
				{block.startMatch} - {block.lastMatch}
			</h2>
			<Group position='center' align='center'>
				<Stack p='md'>
					<Text fw={600}>
						Blue 1A:
						<br /> {block.blue1a?.firstName} {block.blue1a?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Blue 1B:
						<br /> {block.blue1b?.firstName} {block.blue1b?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Blue 2A:
						<br /> {block.blue2a?.firstName} {block.blue2b?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Blue 2B:
						<br /> {block.blue2b?.firstName} {block.blue2b?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Blue 3A:
						<br /> {block.blue3a?.firstName} {block.blue3a?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Blue 3B:
						<br /> {block.blue3b?.firstName} {block.blue3b?.lastName[0]}
					</Text>
				</Stack>
				<Stack p='md'>
					<Text fw={600}>
						Red 1A:
						<br /> {block.red1a?.firstName} {block.red1a?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Red 1B:
						<br /> {block.red1b?.firstName} {block.red1b?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Red 2A:
						<br /> {block.red2a?.firstName} {block.red2a?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Red 2B:
						<br /> {block.red2b?.firstName} {block.red2b?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Red 3A:
						<br /> {block.red3a?.firstName} {block.red3a?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Red 3B:
						<br /> {block.red3b?.firstName} {block.red3b?.lastName[0]}
					</Text>
				</Stack>
			</Group>
			{user.administrator && (
				<Button component={Link} href={`/scouting-schedule/${block._id}`}>
					Edit Block
				</Button>
			)}
		</Card>
	);
};

const ScoutingSchedule = () => {
	const { user } = useUser({ canRedirect: true });
	const { data, mutate } = useSWR<ScheduleBlockI[]>('/api/schedule', fetcher);
	const [showMyBlocks, setShowMyBlocks] = useLocalStorage({
		key: 'showMyBlocks',
		defaultValue: true,
	});

	if (!user || !data) return <Loader size='xl' />;

	return (
		<>
			{user.administrator && (
				<Button component={Link} href='/scouting-schedule/create'>
					Create Schedule
				</Button>
			)}
			{user.administrator && (
				<Button component={Link} href='/scouting-schedule/create-block'>
					Create Block
				</Button>
			)}
			{user.administrator && (
				<Button onClick={() => fetch('/api/schedule/clear').then(() => mutate())}>
					Clear Schedule
				</Button>
			)}
			<Stack align='center' justify='center'>
				<Checkbox
					onChange={(e) => setShowMyBlocks(e.target.checked)}
					label='Show My Blocks'
					checked={showMyBlocks}
				/>
			</Stack>
			<Group px='md' align='center' position='center'>
				{data
					.sort((a, b) => a.startMatch - b.startMatch)
					.filter(showMyBlocks ? (block) => userIsScouting(user, block) : () => true)
					.map((block) => (
						<BlockDisplay key={block._id} user={user} block={block} />
					))}
			</Group>
		</>
	);
};

const userIsScouting = (user: UserI, match: ScheduleBlockI) => {
	return (
		match.blue1a?.username === user.username ||
		match.blue1b?.username === user.username ||
		match.blue2a?.username === user.username ||
		match.blue2b?.username === user.username ||
		match.blue3a?.username === user.username ||
		match.blue3b?.username === user.username ||
		match.red1a?.username === user.username ||
		match.red1b?.username === user.username ||
		match.red2a?.username === user.username ||
		match.red2b?.username === user.username ||
		match.red3a?.username === user.username ||
		match.red3b?.username === user.username
	);
};

export default ScoutingSchedule;
