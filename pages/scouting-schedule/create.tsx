import { NumberSelect } from '@/components/Forms/NumberSelect';
import { Loader, TextInput } from '@mantine/core';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Box, Checkbox, Divider, Button } from '@mantine/core';
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
					<Checkbox
						onChange={(e) =>
							setResults((prev) => ({
								...prev,
								[user._id]: e.target.checked,
							}))
						}
						sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
						checked={
							results[user._id] !== undefined ? results[user._id] : user.canScout
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
	const { control, register, handleSubmit } = useForm<ScheduleOptionsForm>();

	const submitCanScouts = async (data: ScheduleOptionsForm) => {
		setFetching('fetching');
		console.log(data);
		await fetch(`/api/create-schedule?auto=${auto}`, {
			method: 'POST',
			body: JSON.stringify({
				users: { ...resultsDefaults(users), ...results },
				options: {
					...data,
					startTime: new Date(data.startTime).valueOf(),
					endTime: new Date(data.endTime).valueOf(),
					lunchStartTime: new Date(data.lunchStartTime).valueOf(),
					lunchEndTime: new Date(data.lunchEndTime).valueOf(),
				},
			}),
		});
		setFetching('done');
	};

	if (!user || !users) return <Loader size='xl' />;

	if (!user.administrator) return <h1>You are not authorized to use this.</h1>;

	return (
		<>
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
				<NumberSelect
					name='blockLength'
					label='Block Length'
					control={control}
					data={[15, 30, 45, 60]}
				/>
				<TextInput
					label='Start Time'
					{...register('startTime', { required: true })}
					type='datetime-local'
				/>
				<TextInput
					label='End Time'
					{...register('endTime', { required: true })}
					type='datetime-local'
				/>
				<TextInput
					label='Lunch Start Time'
					{...register('lunchStartTime', { required: true })}
					type='datetime-local'
				/>
				<TextInput
					label='Lunch End Time'
					{...register('lunchEndTime', { required: true })}
					type='datetime-local'
				/>

				<Checkbox
					onChange={(e) => setAuto(e.target.checked)}
					sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
					checked={auto}
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
					{fetching === 'fetching' && <Loader color='inherit' size='1rem' />}
					Submit
				</Button>
			</form>
		</>
	);
};

export default Create;
