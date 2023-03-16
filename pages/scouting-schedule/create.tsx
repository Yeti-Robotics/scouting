import { NumberSelect } from '@/components/Forms/NumberSelect';
import { Group, Loader, Stack } from '@mantine/core';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Box, Checkbox, Divider, Button } from '@mantine/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { ControlledDateTimePicker } from '@/components/Forms/ControlledDateTimePicker';

const UserDisplay = ({
	user,
	state,
}: {
	user: UserI;
	state: [Record<string, boolean>, React.Dispatch<React.SetStateAction<Record<string, boolean>>>];
}) => {
	const [results, setResults] = state;
	return (
		<div key={user._id}>
			<Group align='center' position='center' px='md'>
				<Box>
					{user.firstName} {user.lastName}
				</Box>
				<Box>
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
			</Group>
			<Divider />
		</div>
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
			<Box component='form' m='md' onSubmit={handleSubmit(submitCanScouts)}>
				<Stack align='flex'>
					<NumberSelect
						name='blockLength'
						label='Block Length'
						control={control}
						required
						data={[15, 30, 45, 60]}
					/>
					<ControlledDateTimePicker
						label='Start Time'
						name='startTime'
						required
						control={control}
						valueAsString
					/>
					<ControlledDateTimePicker
						label='End Time'
						name='endTime'
						required
						control={control}
						valueAsString
					/>
					<ControlledDateTimePicker
						label='Lunch Start Time'
						name='lunchStartTime'
						required
						control={control}
						valueAsString
					/>
					<ControlledDateTimePicker
						label='Lunch End Time'
						name='lunchEndTime'
						required
						control={control}
						valueAsString
					/>

					<Checkbox
						onChange={(e) => setAuto(e.target.checked)}
						checked={auto}
						label='Auto Generate'
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
				</Stack>
				<Stack align='center'>
					<Button type='submit' mt='md' loading={fetching === 'fetching'}>
						Submit
					</Button>
				</Stack>
			</Box>
		</>
	);
};

export default Create;
