import MatchDisplay from '@/components/Casino/MatchDisplay';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { Button, Input, TextField } from '@mui/material';
import Link from 'next/link';
import { useRef } from 'react';
import useSWR from 'swr';

const Matches = () => {
	const { user } = useUser({ canRedirect: true });
	const { data, mutate } = useSWR<MatchI[]>('/api/matches', fetcher);
	const eventKeyRef = useRef<HTMLInputElement>(null);

	if (!user || !data) return <LoadingLayout />;

	return (
		<Layout>
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
				<>
					<TextField
						label='TBA Event Key'
						placeholder='<year><event key>'
						inputProps={{ ref: eventKeyRef }}
						sx={{ margin: 2 }}
					/>
					<Button
						color='success'
						variant='contained'
						sx={{ textTransform: 'none' }}
						onClick={() =>
							eventKeyRef.current?.value &&
							fetch(`/api/populate-matches?evKey=${eventKeyRef.current?.value}`).then(
								(res) => (res.ok ? mutate() : null),
							)
						}
					>
						Populate Matches
					</Button>
				</>
			)}
			<MatchDisplay matches={data} />
		</Layout>
	);
};

export default Matches;
