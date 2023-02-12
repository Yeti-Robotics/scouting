import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Box, Button, Checkbox, Loader, NumberInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/useUser';

interface Props {
	matches: MatchI[];
}

const userHasBetOn = (match: MatchI, user: UserI) =>
	match.bets.map((bet) => bet.username).includes(user.username);

const Match = ({ match, user, i }: { match: MatchI; user: UserI; i: number }) => {
	const [time, setTime] = useState(match.startTime - Date.now() / 1000);

	useEffect(() => {
		const interval = setInterval(() => {
			if (i !== 0) return;
			setTime(match.startTime - Date.now() / 1000);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

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
				{i === 0 && (
					<p>
						Bets close in:{' '}
						{`${(time / 60).toFixed(0)}:${time % 60 < 9 ? '0' : ''}${(
							time % 60
						).toFixed(0)}`}
					</p>
				)}
				{userHasBetOn(match, user) && 'You have bet on this Match.'}
			</Button>
		</Link>
	);
};

const MatchDisplay = ({ matches }: Props) => {
	const { user } = useUser({ canRedirect: false });
	const [showHasBetOn, setShowHasBetOn] = useState(false);
	const [showPastMatches, setShowPastMatches] = useState(false);
	const [amountToShow, setAmountToShow] = useState(4);

	if (!user) return <Loader size='xl' />;

	return (
		<>
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				<Checkbox
					onChange={(e) => setShowHasBetOn(e.target.checked)}
					label='Show Has Bet On'
					checked={showHasBetOn}
				/>

				<Checkbox
					label='Show Past Matches'
					onChange={(e) => setShowPastMatches(e.target.checked)}
					checked={showPastMatches}
				/>

				<NumberInput
					onChange={(v) => setAmountToShow(v || 1)}
					type='number'
					label='Amount To Show'
					value={amountToShow}
					min={1}
				/>
			</Box>
			<Box sx={{ padding: 2, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
				{matches
					.filter(
						showPastMatches
							? () => true
							: (match) => match.startTime > Date.now() / 1000,
					) // wont show up is match after scheduled start time
					.filter(showHasBetOn ? () => true : (match) => !userHasBetOn(match, user))
					.sort((a, b) => a.startTime - b.startTime) // closest to starting to farthest
					.slice(0, amountToShow)
					.map((match, i) => (
						<Match match={match} user={user} i={i} key={match._id} />
					))}
			</Box>
		</>
	);
};

export default MatchDisplay;
