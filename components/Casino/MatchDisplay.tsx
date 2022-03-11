import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	CircularProgress,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/useUser';

interface Props {
	matches: MatchI[];
}

const userHasBetOn = (match: MatchI, user: UserI) =>
	match.bets.map((bet) => bet.username).includes(user.username);

const Match: React.VFC<{ match: MatchI; user: UserI }> = ({ match, user }) => {
	return (
		<Link href={`/casino/matches/${match._id}`} passHref>
			<Button
				component='a'
				variant='contained'
				sx={{
					textTransform: 'none',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					margin: 2,
					flexGrow: 1,
				}}
			>
				<Box component='h2' sx={{ mb: 0 }}>
					Match #: {match.matchNumber}
				</Box>
				<Box component='h3' sx={{ mt: 0 }}>
					Set #: {match.setNumber}
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							padding: 2,
							borderRadius: 1,
							backgroundColor: 'blue',
							color: 'white',
							fontWeight: 'bold',
							margin: 1,
						}}
					>
						<p>Blue 1: {match.blue1}</p>
						<p>Blue 2: {match.blue2}</p>
						<p>Blue 3: {match.blue3}</p>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							padding: 2,
							borderRadius: 1,
							backgroundColor: 'red',
							color: 'white',
							fontWeight: 'bold',
							margin: 1,
						}}
					>
						<p>Red 1: {match.red1}</p>
						<p>Red 2: {match.red2}</p>
						<p>Red 3: {match.red3}</p>
					</Box>
				</Box>
				{userHasBetOn(match, user) && 'You have bet on this Match.'}
			</Button>
		</Link>
	);
};

const MatchDisplay: React.VFC<Props> = ({ matches }) => {
	const { user } = useUser({ canRedirect: false });
	const [showHasBetOn, setShowHasBetOn] = useState(false);
	const [showPastMatches, setShowPastMatches] = useState(false);
	const [amountToShow, setAmountToShow] = useState(4);

	if (!user) return <CircularProgress />;

	return (
		<>
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				<FormControlLabel
					label='Show Has Bet On'
					control={
						<Checkbox
							onChange={(e) => setShowHasBetOn(e.target.checked)}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
							checked={showHasBetOn}
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
				<TextField
					inputProps={{
						onChange: (e) =>
							setAmountToShow(
								parseInt(e.currentTarget.value) >= 1
									? parseInt(e.currentTarget.value)
									: 1,
							),
					}}
					type='number'
					label='Amount To Show'
					value={amountToShow}
				/>
			</Box>
			<Box sx={{ padding: 2, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
				{matches
					// .filter(showPastMatches ? () => true : (match) => match.startTime < Date.now() + 300000) // wont show up is match is in next 5 mins (300000 millisecondss)
					.filter(showHasBetOn ? () => true : (match) => !userHasBetOn(match, user))
					.sort((a, b) => a.startTime - b.startTime) // closest to starting to farthest
					.slice(0, amountToShow)
					.map((match) => (
						<Match match={match} user={user} key={match._id} />
					))}
			</Box>
		</>
	);
};

export default MatchDisplay;
