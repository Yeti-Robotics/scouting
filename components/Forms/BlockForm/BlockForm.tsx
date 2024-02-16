import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { CreateScheduleBlock, ScheduleBlockI } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { IconTrash } from '@tabler/icons-react';
import {
	ActionIcon,
	AutocompleteItem,
	AutocompleteProps,
	Box,
	Button,
	Group,
	Loader,
	Stack,
	Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { ControlledAutocomplete } from '../ControlledAutocomplete';
import FormSection from '../FormSection';
import { onSubmit } from './onSubmit';
import { ControlledNumberInput } from '../ControlledNumberInput';

interface Props {
	create: boolean;
	defaultBlock?: ScheduleBlockI;
	canEdit?: boolean;
	id?: string;
}

const fullBlockToCreate = (fullBlock: ScheduleBlockI | undefined): CreateScheduleBlock => {
	(fullBlock as unknown) = {
		...fullBlock,
		blue1a: fullBlock?.blue1a?.username,
		blue1b: fullBlock?.blue1b?.username,
		blue2a: fullBlock?.blue2a?.username,
		blue2b: fullBlock?.blue2b?.username,
		blue3a: fullBlock?.blue3a?.username,
		blue3b: fullBlock?.blue3b?.username,
		red1a: fullBlock?.red1a?.username,
		red1b: fullBlock?.red1b?.username,
		red2a: fullBlock?.red2a?.username,
		red2b: fullBlock?.red2b?.username,
		red3a: fullBlock?.red3a?.username,
		red3b: fullBlock?.red3b?.username,
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

	const filter: AutocompleteProps['filter'] = (v: string, item) => {
		const compV = v.toLowerCase().trim();
		const user = usersMap[item.value];
		return (
			user.firstName.toLowerCase().includes(compV) ||
			user.lastName.toLowerCase().includes(compV) ||
			user.username.toLowerCase().includes(compV)
		);
	};

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
			<FormSection title='Schedule'>
				<Group>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='blue1a'
						label='Blue 1A'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='blue1b'
						label='Blue 1B'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
				</Group>
				<Group>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='blue2a'
						label='Blue 2A'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='blue2b'
						label='Blue 2B'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
				</Group>
				<Group>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='blue3a'
						label='Blue 3A'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='blue3b'
						label='Blue 3B'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
				</Group>
				<Group>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='red1a'
						label='Red 1A'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='red1b'
						label='Red 1B'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
				</Group>
				<Group>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='red2a'
						label='Red 2A'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='red2b'
						label='Red 2B'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
				</Group>
				<Group>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='red3a'
						label='Red 3A'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
					<ControlledAutocomplete
						control={control}
						data={options}
						name='red3b'
						label='Red 3B'
						disabled={!canEdit}
						maxDropdownHeight={400}
						limit={8}
						filter={filter}
						rules={{ required: false, validate: undefined }}
					/>
				</Group>
				<Group align='center'>
					<ControlledNumberInput
						control={control}
						name='startMatch'
						label='Start Match'
						disabled={!canEdit}
						hideControls
						min={1}
						rules={{ required: true }}
					/>
					<Text weight='bold'>-</Text>
					<ControlledNumberInput
						control={control}
						name='lastMatch'
						label='Last Match'
						disabled={!canEdit}
						hideControls
						min={1}
						rules={{ required: true }}
					/>
				</Group>
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
