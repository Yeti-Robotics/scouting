import { useUser } from '@/lib/useUser';
import { pieceSourceEnum, PitFormI, whereScoreEnum } from '@/models/PitForm';
import { PitImageI } from '@/models/PitImage';
import { IconTrash } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Loader, Stack, Text, Textarea } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ControlledAutocomplete } from '../ControlledAutocomplete';
import FormSection from '../FormSection';
import Images from './Images';
import { onSubmit } from './onSubmit';
import { ControlledNumberInput } from '../ControlledNumberInput';
import { openWarningModal } from '@/lib/warningModal';
import { ControlledMultiSelect } from '../ControlledMultiSelect';
import { ControlledSelect } from '../ControlledSelect';

type Props = {
	create: boolean;
	defaultForm?: PitFormI;
	defaultImages?: PitImageI[];
	canEdit?: boolean;
	id?: string;
};

export const PitForm = ({ create, defaultForm, canEdit, defaultImages, id }: Props) => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const [submitting, setSubmitting] = useState<'fetching' | 'done' | ''>('');
	const [images, setImages] = useState<Partial<PitImageI & { listId: number }>[]>(
		defaultImages || [],
	);
	const { control, handleSubmit, reset, register } = useForm<PitFormI>({
		defaultValues: {
			pieceSources: [],
			whereScore: [],
			priorityScore: undefined,
			drivetrain: undefined,
			...defaultForm,
		},
	});

	if (!user && create) {
		return <Loader size='xl' />;
	}

	if (user && create && user.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit(onSubmit(create, user, reset, images, setImages, setSubmitting))}
		>
			{user && user.administrator && !create && id && (
				<ActionIcon
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					size='xl'
					variant='filled'
					color='error'
					onClick={() => {
						openWarningModal({
							route: `/api/forms/pit/${id}`,
							method: 'DELETE',
							onRes: (res) => res.ok && router.push('/records/pit-forms'),
						});
					}}
				>
					<IconTrash />
				</ActionIcon>
			)}
			<Stack mx='md'>
				<FormSection title='Images'>
					<Images state={[images, setImages]} canEdit={canEdit} />
				</FormSection>
				<FormSection title='Info'>
					<ControlledNumberInput
						control={control}
						name='teamNumber'
						label='Team Number'
						type='number'
						disabled={!canEdit}
						rules={{ required: true, min: 1 }}
						required
						hideControls
						min={1}
					/>
					<ControlledAutocomplete
						name='drivetrain'
						label='What drivetrain do they use?'
						control={control}
						rules={{ required: true }}
						required
						data={['Swerve', 'West Coast', 'Mechaunum']}
					/>
					<ControlledNumberInput
						name='weight'
						control={control}
						label='Weight'
						description='pounds'
						required
						hideControls
						min={1}
					/>
					<ControlledNumberInput
						name='length'
						control={control}
						label='Length (With Bumpers)'
						description='inches'
						required
						hideControls
						min={1}
					/>
					<ControlledNumberInput
						name='width'
						control={control}
						label='Width (With Bumpers)'
						description='inches'
						required
						hideControls
						min={1}
					/>
					<ControlledMultiSelect
						name='pieceSources'
						control={control}
						label='Where they get pieces?'
						data={pieceSourceEnum}
					/>
					<ControlledMultiSelect
						name='whereScore'
						control={control}
						label='Where do they score?'
						data={whereScoreEnum}
					/>
					<ControlledSelect
						name='priorityScore'
						control={control}
						label='Preferred scoring location?'
						data={[...whereScoreEnum, 'None']}
						required
					/>
					<Textarea
						{...register('notes', { required: true })}
						label='Notes'
						disabled={!canEdit}
						required
					/>
					<Text align='center'>
						Give some more insight into the team such as cycle times.
					</Text>
				</FormSection>
				{Boolean(canEdit) && (
					<Stack align='center'>
						<Button type='submit' loading={submitting === 'fetching'}>
							{create ? 'Submit' : 'Update'}
						</Button>
					</Stack>
				)}
			</Stack>
		</Box>
	);
};
