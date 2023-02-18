import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Card, Checkbox, Group, Loader, NumberInput, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from '@/components/Link';
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
		<Card
			component={Link}
			href={`/casino/matches/${match._id}`}
			withBorder
			shadow='md'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				flexGrow: 1,
			}}
		>
			<Title order={2}>Match #: {match.matchNumber}</Title>
			<Title order={3}>Set #: {match.setNumber}</Title>
			<Group align='center' position='center'>
				<Stack align='center' p='md'>
					<p>Blue 1: {match.blue1}</p>
					<p>Blue 2: {match.blue2}</p>
					<p>Blue 3: {match.blue3}</p>
				</Stack>
				<Stack align='center' p='md'>
					<p>Red 1: {match.red1}</p>
					<p>Red 2: {match.red2}</p>
					<p>Red 3: {match.red3}</p>
				</Stack>
			</Group>
			{i === 0 && (
				<Text>
					Bets close in:{' '}
					{`${(time / 60).toFixed(0)}:${time % 60 < 9 ? '0' : ''}${(time % 60).toFixed(
						0,
					)}`}
				</Text>
			)}
			{userHasBetOn(match, user) && 'You have bet on this Match.'}
		</Card>
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
			<Stack align='center' sx={{ display: 'flex', flexWrap: 'wrap' }}>
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
			</Stack>
			<Group p='md'>
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
			</Group>
		</>
	);
};

export default MatchDisplay;
