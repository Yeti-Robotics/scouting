import MatchDisplay from '@/components/Casino/MatchDisplay';
import { Link } from '@/components/Link';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { Button, Loader, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import useSWR from 'swr';

const Matches = () => {
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<MatchI[]>('/api/matches', fetcher);
	const [eventKey, setEventKey] = useState('');

	if (!user || !data) return <Loader size='xl' />;

	return (
		<>
			<h1>Matches</h1>

			{user.administrator && (
				<Link href='/casino/matches/create' passHref>
					<Button
						component='a'
						color='success'
						variant='contained'
						sx={{ textTransform: 'none' }}
					>
						Create a Match
					</Button>
				</Link>
			)}
			{user.administrator && (
				<Stack>
					<TextInput
						label='TBA Event Key'
						placeholder='<year><event key>'
						value={eventKey}
						onChange={(e) => setEventKey(e.target.value)}
						sx={{ margin: 2 }}
					/>
					<Button color='success' variant='contained' sx={{ textTransform: 'none' }}>
						Populate Matches
					</Button>
				</Stack>
			)}
			{user.administrator && (
				<Button color='success' variant='contained' sx={{ textTransform: 'none' }}>
					Clear Matches
				</Button>
			)}
			<MatchDisplay matches={data} />
		</>
	);
};

export default Matches;
