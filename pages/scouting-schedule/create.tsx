import Select from '@/components/Forms/Select';
import TextInput from '@/components/Forms/TextInput';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import {
	Box,
	Checkbox,
	Divider,
	FormControlLabel,
	Button,
	CircularProgress,
	MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
					justifyContent: 'center',
					width: '100%',
					padding: '0 0.5rem',
				}}
			>
				<Box mr={1}>
					{user.firstName} {user.lastName}
				</Box>
				<Box ml={1}>
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
								checked={
									results[user._id] !== undefined
										? results[user._id]
										: user.canScout
								}
							/>
						}
					/>
				</Box>
			</Box>
			<Divider />
		</>
	);
};

const resultsDefaults = (users: UserI[] | undefined) => {
	const obj: Record<string, boolean> = {};
	if (!users) return obj;

	users.forEach((user) => (obj[user._id] = user.canScout));
	return obj;
};

export interface ScheduleOptionsForm {
	blockLength: number;
	startTime: string;
	endTime: string;
	lunchStartTime: string;
	lunchEndTime: string;
}

const Create = () => {
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { data: users } = useSWR<UserI[]>('/api/auth/users?normal=true', fetcher);
	const [results, setResults] = useState<Record<string, boolean>>({});
	const [fetching, setFetching] = useState<'' | 'fetching' | 'done'>('');
	const [auto, setAuto] = useState(false);
	const { control, handleSubmit } = useForm<ScheduleOptionsForm>();

	const submitCanScouts = async (data: ScheduleOptionsForm) => {
		setFetching('fetching');
		await fetch(`/api/create-schedule?auto=${auto}`, {
			method: 'POST',
			body: JSON.stringify({
				users: { ...resultsDefaults(users), ...results },
				options: data,
			}),
		});
		setFetching('done');
	};

	if (!user || !users) return <LoadingLayout />;

	if (!user.administrator)
		return (
			<Layout>
				<h1>You are not authorized to use this.</h1>
			</Layout>
		);

	return (
		<Layout>
			<form
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
					padding: '1rem',
				}}
				onSubmit={handleSubmit(submitCanScouts)}
			>
				<Select name='blockLength' label='Block Length' control={control} defaultValue={30}>
					<MenuItem value={15}>15</MenuItem>
					<MenuItem value={30}>30</MenuItem>
					<MenuItem value={45}>45</MenuItem>
					<MenuItem value={60}>60</MenuItem>
				</Select>
				<TextInput
					name='startTime'
					label='Start Time'
					control={control}
					type='datetime-local'
				/>
				<TextInput
					name='endTime'
					label='End Time'
					control={control}
					type='datetime-local'
				/>
				<TextInput
					name='lunchStartTime'
					label='Lunch Start Time'
					control={control}
					type='datetime-local'
				/>
				<TextInput
					name='lunchEndTime'
					label='Lunch End Time'
					control={control}
					type='datetime-local'
				/>

				<FormControlLabel
					label='Auto Generate?'
					control={
						<Checkbox
							onChange={(e) => setAuto(e.target.checked)}
							sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
							checked={auto}
						/>
					}
				/>

				{auto && (
					<>
						<h2>Select Scouters</h2>
						<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
							{users.map((user, i) => (
								<>
									{i === 0 && <Divider />}
									<UserDisplay
										key={user._id}
										user={user}
										state={[results, setResults]}
									/>
								</>
							))}
						</Box>
					</>
				)}
				<Button type='submit' variant='contained' sx={{ mt: 2 }}>
					{fetching === 'fetching' && <CircularProgress color='inherit' size='1rem' />}
					Submit
				</Button>
			</form>
		</Layout>
	);
};

export default Create;
