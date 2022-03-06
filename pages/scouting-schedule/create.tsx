import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Box, Checkbox, Divider, FormControlLabel, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';

const UserDisplay: React.VFC<{
	user: UserI;
	state: [Record<string, boolean>, React.Dispatch<React.SetStateAction<Record<string, boolean>>>];
}> = ({ user, state }) => {
	const [results, setResults] = state;
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
					width: '100%',
					padding: '0 0.5rem',
				}}
			>
				<Box>
					{user.firstName} {user.lastName}
				</Box>
				<Box>
					<FormControlLabel
						label='Can Scout'
						control={
							<Checkbox
								onChange={(e) =>
									setResults((prev) => ({
										...prev,
										[user._id]: e.target.checked,
									}))
								}
								sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
								checked={results[user._id] || user.canScout}
							/>
						}
					/>
				</Box>
			</Box>
			<Divider />
		</>
	);
};

const resultsDefault = (users: UserI[] | undefined) => {
	const obj: Record<string, boolean> = {};
	if (!users) return obj;

	users.forEach((user) => (obj[user._id] = user.canScout));
	return obj;
};

const Create = () => {
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { data } = useSWR<UserI[]>('/api/auth/users?normal=true', fetcher);
	const [results, setResults] = useState<Record<string, boolean>>(resultsDefault(data));
	const [fetching, setFetching] = useState<'' | 'fetching' | 'done'>('');

	const submitCanScouts = async () => {
		setFetching('fetching');
		const res = await fetch('/api/create-schedule', {
			method: 'POST',
			body: JSON.stringify(results),
		});
		setFetching('done');
	};

	if (!user || !data) return <LoadingLayout />;

	return (
		<Layout>
			<Button onClick={submitCanScouts} variant='contained'>
				{fetching === 'fetching' && <CircularProgress color='inherit' size='1rem' />}Submit
			</Button>
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
				{data.map((user) => (
					<UserDisplay key={user._id} user={user} state={[results, setResults]} />
				))}
			</Box>
		</Layout>
	);
};

export default Create;
