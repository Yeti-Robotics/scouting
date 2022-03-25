import MatchDisplay from '@/components/Casino/MatchDisplay';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { Box, Button, Modal, TextField } from '@mui/material';
import Link from 'next/link';
import { useRef, useState } from 'react';
import useSWR from 'swr';

const Matches = () => {
	const { user } = useUser({ canRedirect: true });
	const { data, mutate } = useSWR<MatchI[]>('/api/matches', fetcher);
	const eventKeyRef = useRef<HTMLInputElement>(null);
	const [populateModal, setPopulateModal] = useState(false);
	const [clearModal, setClearModal] = useState(false);

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
						onClick={() => eventKeyRef.current?.value && setPopulateModal(true)}
					>
						Populate Matches
					</Button>
				</>
			)}
			{user.administrator && (
				<Button
					color='success'
					variant='contained'
					sx={{ textTransform: 'none' }}
					onClick={() => setClearModal(true)}
				>
					Clear Matches
				</Button>
			)}
			<Modal open={populateModal} onClose={() => setPopulateModal(false)}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4,
					}}
				>
					<p>
						Performing this action will remove all matches and bets currently in the
						database, are you sure you wish to do this
					</p>
					<Button
						color='error'
						variant='contained'
						onClick={() => {
							eventKeyRef.current?.value &&
								fetch(
									`/api/populate-matches?evKey=${eventKeyRef.current?.value}`,
								).then((res) => {
									if (res.ok) {
										mutate();
										setPopulateModal(false);
									} else {
										null;
									}
								});
						}}
					>
						Yes, Do It
					</Button>
					<Button
						color='success'
						variant='contained'
						onClick={() => setPopulateModal(false)}
					>
						Nah, Go Back
					</Button>
				</Box>
			</Modal>
			<Modal open={clearModal} onClose={() => setClearModal(false)}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4,
					}}
				>
					<p>
						Performing this action will remove all matches and bets currently in the
						database, are you sure you wish to do this
					</p>
					<Button
						color='error'
						variant='contained'
						onClick={() => {
							fetch(`/api/clear-matches`).then((res) => {
								if (res.ok) {
									mutate();
									setClearModal(false);
								} else {
									null;
								}
							});
						}}
					>
						Yes, Do It
					</Button>
					<Button
						color='success'
						variant='contained'
						onClick={() => setPopulateModal(false)}
					>
						Nah, Go Back
					</Button>
				</Box>
			</Modal>
			<MatchDisplay matches={data} />
		</Layout>
	);
};

export default Matches;
