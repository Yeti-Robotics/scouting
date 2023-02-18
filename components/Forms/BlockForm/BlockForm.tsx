import fetcher from '@/lib/fetch';
import { numToDateTimeInput } from '@/lib/formatDate';
import { useUser } from '@/lib/useUser';
import { CreateScheduleBlock, ScheduleBlockI } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { IconTrash } from '@tabler/icons-react';
import { ActionIcon, AutocompleteItem, Box, Button, Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { ControlledAutocomplete } from '../ControlledAutocomplete';
import FormSection from '../FormSection';
import { onSubmit } from './onSubmit';
import { ControlledDateTimePicker } from '../ControlledDateTimePicker';

interface Props {
	create: boolean;
	defaultBlock: ScheduleBlockI;
	canEdit?: boolean;
	id?: string;
}

const fullBlockToCreate = (fullBlock: ScheduleBlockI | undefined): CreateScheduleBlock => {
	(fullBlock as unknown) = {
		...fullBlock,
		blue1: fullBlock?.blue1?.username,
		blue2: fullBlock?.blue2?.username,
		blue3: fullBlock?.blue3?.username,
		red1: fullBlock?.red1?.username,
		red2: fullBlock?.red2?.username,
		red3: fullBlock?.red3?.username,
	};
	return fullBlock as CreateScheduleBlock;
};

export const BlockForm = ({ create, defaultBlock, canEdit, id }: Props) => {
	const router = useRouter();
	const { data: users } = useSWR<UserI[]>('/api/auth/users?normal=true', fetcher);
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { control, handleSubmit } = useForm<CreateScheduleBlock>({
		defaultValues: {
			...fullBlockToCreate(defaultBlock),
			startTime: numToDateTimeInput(defaultBlock.startTime) as any,
			endTime: numToDateTimeInput(defaultBlock.endTime) as any,
		},
	});

	if (!user || !users) return <Loader size='xl' />;
	const usersMap = Object.fromEntries(users.map((user) => [user.username, user]));
	const options: AutocompleteItem[] = users.map((user) => ({
		value: user.username,
		label: `${user.firstName} ${user.lastName} (${user.username})`,
	}));

	if (!user.administrator) {
		return <h1>You are not authorized to use this!</h1>;
	}

	if (user.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Box component='form' onSubmit={handleSubmit(onSubmit(create, user, usersMap))}>
			{user && user.administrator && !create && id && (
				<ActionIcon
					variant='filled'
					size='xl'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='error'
					onClick={() => {
						fetch(`/api/schedule/${id}`, { method: 'DELETE' }).then((res) => {
							if (res.ok) router.push('/scouting-schedule');
						});
					}}
				>
					<IconTrash />
				</ActionIcon>
			)}
			<FormSection title='Info'>
				<ControlledAutocomplete
					control={control}
					data={options}
					name='blue1'
					label='Blue 1'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<ControlledAutocomplete
					control={control}
					data={options}
					name='blue2'
					label='Blue 2'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<ControlledAutocomplete
					control={control}
					data={options}
					name='blue3'
					label='Blue 3'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<ControlledAutocomplete
					control={control}
					data={options}
					name='red1'
					label='Red 1'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<ControlledAutocomplete
					control={control}
					data={options}
					name='red2'
					label='Red 2'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<ControlledAutocomplete
					control={control}
					data={options}
					name='red3'
					label='Red 3'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<ControlledDateTimePicker
					control={control}
					name='startTime'
					label='Start Time'
					disabled={!canEdit}
					rules={{ required: true }}
					valueAsString
				/>
				<ControlledDateTimePicker
					control={control}
					name='endTime'
					label='End Time'
					disabled={!canEdit}
					rules={{ required: true }}
					valueAsString
				/>
			</FormSection>
			<Stack align='center' mt='md'>
				<Button type='submit' disabled={!canEdit}>
					{create ? 'Submit' : 'Update'}
				</Button>
			</Stack>
		</Box>
	);
};

export default BlockForm;
