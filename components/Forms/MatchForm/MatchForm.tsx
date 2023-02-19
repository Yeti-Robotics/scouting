import { numToDateTimeInput } from '@/lib/formatDate';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { IconTrash } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';
import { ControlledSelect } from '../ControlledSelect';
import { onSubmit } from './onSubmit';
import { ControlledNumberInput } from '../ControlledNumberInput';
import { ControlledDateTimePicker } from '../ControlledDateTimePicker';
import { openWarningModal } from '@/lib/warningModal';

type Props = {
	create: boolean;
	defaultMatch?: MatchI;
	canEdit?: boolean;
	id?: string;
};

export type FormMatch = Omit<MatchI, 'startTime'> & { startTime: string };

const MatchForm = ({ create, defaultMatch, canEdit, id }: Props) => {
	const router = useRouter();
	const [closing, setClosing] = useState<'' | 'fetching' | 'done'>('');
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { handleSubmit, control, watch } = useForm<FormMatch>({
		defaultValues: {
			...defaultMatch,
			startTime: defaultMatch?.startTime
				? numToDateTimeInput(defaultMatch.startTime)
				: undefined,
		},
	});
	const winner = watch('winner');

	if (!user) return <Loader size='xl' />;

	if (!user.administrator) {
		return <h1>You are not authorized to use this!</h1>;
	}

	if (user.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Box component='form' onSubmit={handleSubmit(onSubmit(create, user, router))}>
			{user && user.administrator && !create && id && (
				<ActionIcon
					variant='filled'
					size='xl'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='error'
					onClick={() => {
						openWarningModal({
							route: `/api/matches/${id}`,
							method: 'DELETE',
							onRes: (res) => res.ok && router.push('/casino/matches'),
						});
					}}
				>
					<IconTrash />
				</ActionIcon>
			)}
			<FormSection title='Info'>
				<Box sx={{ display: 'flex', width: '100%' }}>
					<div style={{ width: '100%', margin: '0.5rem' }}>
						<ControlledNumberInput
							hideControls
							control={control}
							name='blue1'
							label='Blue 1'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
							min={1}
						/>
						<ControlledNumberInput
							hideControls
							control={control}
							name='blue2'
							label='Blue 2'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
							min={1}
						/>
						<ControlledNumberInput
							hideControls
							control={control}
							name='blue3'
							label='Blue 3'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
							min={1}
						/>
					</div>
					<div style={{ width: '100%', margin: '0.5rem' }}>
						<ControlledNumberInput
							hideControls
							control={control}
							name='red1'
							label='Red 1'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
							min={1}
						/>
						<ControlledNumberInput
							hideControls
							control={control}
							name='red2'
							label='Red 2'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
							min={1}
						/>
						<ControlledNumberInput
							hideControls
							control={control}
							name='red3'
							label='Red 3'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
							min={1}
						/>
					</div>
				</Box>
				<Stack>
					<ControlledNumberInput
						control={control}
						name='matchNumber'
						label='Match Number'
						min={1}
						required
						rules={{ min: 1 }}
					/>
					<ControlledDateTimePicker
						control={control}
						name='startTime'
						label='Start Time'
						valueAsString
						required
					/>
				</Stack>
				{!create && (
					<ControlledSelect
						control={control}
						name='winner'
						label='Winner'
						required
						rules={{ required: false }}
						data={[
							{ value: 'blue', label: 'Blue Alliance' },
							{ value: 'red', label: 'Red Alliance' },
							{ value: 'tie', label: 'Tie or No Winner' },
						]}
					/>
				)}
			</FormSection>
			{!create && defaultMatch?.open && (
				<Button
					type='button'
					variant='contained'
					loading={closing === 'fetching'}
					onClick={() => {
						if (!winner) return;
						setClosing('fetching');
						fetch(`/api/matches/${id}/close?winner=${winner}`).then((res) => {
							setClosing('done');
							if (!res.ok) console.error('failed to close match.');
						});
					}}
				>
					Close Bets
				</Button>
			)}
			<Button mt='md' fullWidth type='submit'>
				{create ? 'Submit' : 'Update'}
			</Button>
		</Box>
	);
};

export default MatchForm;
