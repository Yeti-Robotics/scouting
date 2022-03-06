import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchSchedule } from '@/models/Match';
import { UserI } from '@/models/User';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

const Divider = () => <span style={{ backgroundColor: 'white', padding: '1px 0' }} />;

const MatchDisplay: React.VFC<{ match: MatchSchedule; user: UserI }> = ({ user, match }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: 'primary.main',
				borderRadius: '4px',
				flexGrow: 1,
				padding: 1,
				margin: 1,
			}}
		>
			<h2 style={{ margin: 0 }}>Match {match.matchNumber}</h2>
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
						backgroundColor: 'blue',
						padding: 1,
						margin: 1,
						borderRadius: '4px',
					}}
				>
					<Box>
						Blue 1 ({match.blue1}):
						<br /> {match.scouters?.blue1?.firstName}{' '}
						{match.scouters?.blue1?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Blue 2 ({match.blue2}):
						<br /> {match.scouters?.blue2?.firstName}{' '}
						{match.scouters?.blue2?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Blue 3 ({match.blue3}):
						<br /> {match.scouters?.blue3?.firstName}{' '}
						{match.scouters?.blue3?.lastName[0]}
					</Box>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						backgroundColor: 'red',
						padding: 1,
						margin: 1,
						borderRadius: '4px',
					}}
				>
					<Box>
						Red 1 ({match.red1}):
						<br /> {match.scouters?.red1?.firstName} {match.scouters?.red1?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Red 2 ({match.red2}):
						<br /> {match.scouters?.red2?.firstName} {match.scouters?.red2?.lastName[0]}
					</Box>
					<Divider />
					<Box>
						Red 3 ({match.red3}):
						<br /> {match.scouters?.red3?.firstName} {match.scouters?.red3?.lastName[0]}
					</Box>
				</Box>
			</Box>
			{user.administrator && (
				<Link href={`/casino/matches/${match._id}/edit`} passHref>
					<Button variant='contained'>Edit Match</Button>
				</Link>
			)}
		</Box>
	);
};

const ScoutingSchedule = () => {
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<MatchSchedule[]>('/api/matches?schedule=true', fetcher);
	const [showMyMatches, setShowMyMatches] = useState(true);
	const [showPastMatches, setShowPastMatches] = useState(false);

	if (!user || !data) return <LoadingLayout />;

	return (
		<Layout>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<FormControlLabel
					label='Show Only My Matches'
					control={
						<Checkbox
							onChange={(e) => setShowMyMatches(e.target.checked)}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
							checked={showMyMatches}
						/>
					}
				/>
				<FormControlLabel
					label='Show Past Matches'
					control={
						<Checkbox
							onChange={(e) => setShowPastMatches(e.target.checked)}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
							checked={showPastMatches}
						/>
					}
				/>
			</Box>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
				{data
					.sort((a, b) => a.matchNumber - b.matchNumber)
					// .filter(showPastMatches ? () => true : (match) => match.startTime < Date.now()) // wont show up is match is in next 5 mins (300000 millisecondss)
					.filter(showMyMatches ? (match) => userIsScouting(user, match) : () => true)
					.map((match) => (
						<MatchDisplay key={match._id} user={user} match={match} />
					))}
			</Box>
		</Layout>
	);
};

const userIsScouting = (user: UserI, match: MatchSchedule) => {
	return (
		match.scouters?.blue1?.username === user.username ||
		match.scouters?.blue2?.username === user.username ||
		match.scouters?.blue3?.username === user.username ||
		match.scouters?.red1?.username === user.username ||
		match.scouters?.red2?.username === user.username ||
		match.scouters?.red3?.username === user.username
	);
};

export default ScoutingSchedule;
