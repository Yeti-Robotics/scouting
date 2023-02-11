import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { ScheduleBlockI } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { Loader } from '@mantine/core';
import { Box, Button, Checkbox, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

const Divider = () => <span style={{ backgroundColor: 'white', padding: '1px 0' }} />;

const BlockDisplay: React.VFC<{ block: ScheduleBlockI; user: UserI }> = ({ user, block }) => {
	const theme = useMantineTheme();
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: 'primary.main',
				borderRadius: '4px',
				'&.MuiButton-contained': {
					color: 'white',
				},
				flexGrow: 1,
				padding: 1,
				margin: 1,
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
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontWeight: 500,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						backgroundColor: theme.colors.blue[5],
						padding: 1,
						margin: 1,
						borderRadius: '4px',
					}}
				>
					<Box>
						Blue 1:
						<br /> {block.blue1?.firstName} {block.blue1?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Blue 2:
						<br /> {block.blue2?.firstName} {block.blue2?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Blue 3:
						<br /> {block.blue3?.firstName} {block.blue3?.lastName[0]}
					</Box>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						backgroundColor: theme.colors.red[5],
						padding: 1,
						margin: 1,
						borderRadius: '4px',
					}}
				>
					<Box>
						Red 1:
						<br /> {block.red1?.firstName} {block.red1?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Red 2:
						<br /> {block.red2?.firstName} {block.red2?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Red 3:
						<br /> {block.red3?.firstName} {block.red3?.lastName[0]}
					</Box>
				</Box>
			</Box>
			{user.administrator && (
				<Link href={`/scouting-schedule/${block._id}`} passHref>
					<Button variant='contained'>Edit Block</Button>
				</Link>
			)}
		</Box>
	);
};

const ScoutingSchedule = () => {
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<ScheduleBlockI[]>('/api/schedule', fetcher);
	const [showMyBlocks, setShowMyBlocks] = useState(true);
	const [showPastBlocks, setShowPastBlocks] = useState(false);

	if (!user || !data) return <Loader size='xl' />;

	return (
		<>
			{user.administrator && (
				<Link href='/scouting-schedule/create' passHref>
					<Button component='a' variant='contained'>
						Create Schedule
					</Button>
				</Link>
			)}
			{user.administrator && (
				<Button variant='contained' sx={{ mt: 2 }}>
					Clear Schedule
				</Button>
			)}
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Checkbox
					onChange={(e) => setShowMyBlocks(e.target.checked)}
					sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
					checked={showMyBlocks}
				/>
				<Checkbox
					onChange={(e) => setShowPastBlocks(e.target.checked)}
					sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
					checked={showPastBlocks}
				/>
			</Box>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
				{data
					.filter(showPastBlocks ? () => true : (match) => match.startTime > Date.now()) // wont show up is match is in next 5 mins (300000 millisecondss)
					.filter(showMyBlocks ? (block) => userIsScouting(user, block) : () => true)
					.map((block) => (
						<BlockDisplay key={block._id} user={user} block={block} />
					))}
			</Box>
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
