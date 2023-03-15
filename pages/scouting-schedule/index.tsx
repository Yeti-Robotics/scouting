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
				{new Date(block.startTime).toLocaleTimeString(undefined, {
					hour: '2-digit',
					minute: '2-digit',
				})}{' '}
				-{' '}
				{new Date(block.endTime).toLocaleTimeString(undefined, {
					hour: '2-digit',
					minute: '2-digit',
				})}
			</h2>
			<Group position='center' align='center'>
				<Stack p='md'>
					<Text fw={600}>
						Blue 1:
						<br /> {block.blue1?.firstName} {block.blue1?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Blue 2:
						<br /> {block.blue2?.firstName} {block.blue2?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Blue 3:
						<br /> {block.blue3?.firstName} {block.blue3?.lastName[0]}
					</Text>
				</Stack>
				<Stack p='md'>
					<Text fw={600}>
						Red 1:
						<br /> {block.red1?.firstName} {block.red1?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Red 2:
						<br /> {block.red2?.firstName} {block.red2?.lastName[0]}
					</Text>
					<Divider />
					<Text fw={600}>
						Red 3:
						<br /> {block.red3?.firstName} {block.red3?.lastName[0]}
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
	const [showPastBlocks, setShowPastBlocks] = useLocalStorage({
		key: 'showPastBlocks',
		defaultValue: false,
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
				<Checkbox
					onChange={(e) => setShowPastBlocks(e.target.checked)}
					label='Show Past Blocks'
					checked={showPastBlocks}
				/>
			</Stack>
			<Group px='md' align='center' position='center'>
				{data
					.filter(
						showPastBlocks
							? () => true
							: (match) => new Date(match.startTime).valueOf() > Date.now(),
					) // wont show up is match is in next 5 mins (300000 millisecondss)
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
		match.blue1?.username === user.username ||
		match.blue2?.username === user.username ||
		match.blue3?.username === user.username ||
		match.red1?.username === user.username ||
		match.red2?.username === user.username ||
		match.red3?.username === user.username
	);
};

export default ScoutingSchedule;
