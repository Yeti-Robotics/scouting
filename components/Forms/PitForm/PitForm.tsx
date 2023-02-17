import { useUser } from '@/lib/useUser';
import { PitFormI } from '@/models/PitForm';
import { PitImageI } from '@/models/PitImage';
import { IconTrash } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Loader, Text, Textarea } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ControlledAutocomplete } from '../ControlledAutocomplete';
import FormSection from '../FormSection';
import Images from './Images';
import { onSubmit } from './onSubmit';
import { ControlledNumberInput } from '../ControlledNumberInput';
import { NumberSelect } from '../NumberSelect';

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
		defaultValues: defaultForm,
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
					color='error'
					onClick={() => {
						fetch(`/api/forms/pit/${id}`, { method: 'DELETE' }).then((res) => {
							if (res.ok) router.push('/records/pit-forms');
						});
					}}
				>
					<IconTrash />
				</ActionIcon>
			)}
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
					min={1}
				/>
				<NumberSelect
					control={control}
					name='endPosition'
					label='Where do they end the game?'
					disabled={!canEdit}
					rules={{ required: true }}
					required
					data={[
						{
							value: 0,
							label: 'Nothing',
						},
						{
							value: 1,
							label: 'Defense',
						},
						{
							value: 2,
							label: 'Scoring',
						},
						{
							value: 3,
							label: 'Parked',
						},
						{
							value: 4,
							label: 'Charger Unbalanced',
						},
						{
							value: 5,
							label: 'Charger Balanced',
						},
					]}
				/>
				<ControlledAutocomplete
					name='drivetrain'
					label='What drivetrain do they use?'
					control={control}
					rules={{ required: true }}
					required
					data={['Swerve', 'West Coast', 'Mechaunum']}
				/>
				<NumberSelect
					control={control}
					name='defense'
					label='Can they play defense?'
					disabled={!canEdit}
					rules={{ required: true }}
					required
					data={[
						{ value: 0, label: "They can't" },
						{ value: 1, label: 'They can' },
						{ value: 2, label: 'It is their strategy' },
					]}
				/>
				<NumberSelect
					control={control}
					name='shooting'
					label='Where do they score?'
					disabled={!canEdit}
					rules={{ required: true }}
					required
					data={[
						{ value: 0, label: "They don't" },
						{ value: 1, label: 'Bottom' },
						{ value: 2, label: 'Middle' },
						{ value: 3, label: 'Top' },
					]}
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
				<Button type='submit' loading={submitting === 'fetching'}>
					{create ? 'Submit' : 'Update'}
				</Button>
			)}
		</Box>
	);
};
