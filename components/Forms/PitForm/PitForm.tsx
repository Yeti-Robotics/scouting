import { useUser } from '@/lib/useUser';
import { PitFormI } from '@/models/PitForm';
import { PitImageI } from '@/models/PitImage';
import { Delete } from '@mui/icons-material';
import { Button, CircularProgress, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Autocomplete from '../ControlledAutocomplete';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import Select from '../ControlledSelect';
import SubmitButton from '../SubmitButton';
import Textarea from '../Textarea';
import TextInput from '../TextInput';
import Images from './Images';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultForm?: PitFormI;
	defaultImages?: PitImageI[];
	canEdit?: boolean;
	id?: string;
}

const PitForm: React.VFC<Props> = ({ create, defaultForm, canEdit, defaultImages, id }) => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const [submitting, setSubmitting] = useState<'fetching' | 'done' | ''>('');
	const [images, setImages] = useState<Partial<PitImageI & { listId: number }>[]>(
		defaultImages || [],
	);
	const { control, handleSubmit, reset } = useForm<PitFormI>({ defaultValues: defaultForm });

	if (!user && create) {
		return <CircularProgress />;
	}

	if (user && create && user.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Form
			onSubmit={handleSubmit(onSubmit(create, user, reset, images, setImages, setSubmitting))}
		>
			{user && user.administrator && !create && id && (
				<Button
					variant='contained'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='error'
					onClick={() => {
						fetch(`/api/forms/pit/${id}`, { method: 'DELETE' }).then((res) => {
							if (res.ok) router.push('/records/pit-forms');
						});
					}}
				>
					<Delete />
				</Button>
			)}
			<FormSection title='Images'>
				<Images state={[images, setImages]} canEdit={canEdit} />
			</FormSection>
			<FormSection title='Info'>
				<TextInput
					control={control}
					name='teamNumber'
					label='Team Number'
					type='number'
					disabled={!canEdit}
					rules={{ required: true, min: 1 }}
				/>
				<Select
					control={control}
					name='endPosition'
					label='Where do they end the game?'
					disabled={!canEdit}
					rules={{ required: true }}
				>
					<MenuItem value={0}>Nothing</MenuItem>
					<MenuItem value={1}>Defense</MenuItem>
					<MenuItem value={2}>Shooting</MenuItem>
					<MenuItem value={3}>Low Climb</MenuItem>
					<MenuItem value={4}>Middle Climb</MenuItem>
					<MenuItem value={5}>High Climb</MenuItem>
					<MenuItem value={6}>Traverse Climb</MenuItem>
				</Select>
				<Autocomplete
					name='drivetrain'
					label='What drivetrain do they use?'
					options={['Swerve', 'West Coast', 'Mechaunum']}
					control={control}
					rules={{ required: true }}
					freeSolo
				/>
				<Select
					control={control}
					name='defense'
					label='Can they play defense?'
					disabled={!canEdit}
					rules={{ required: true }}
				>
					<MenuItem value={0}>They can't</MenuItem>
					<MenuItem value={1}>They can</MenuItem>
					<MenuItem value={2}>It is their strategy</MenuItem>
				</Select>
				<Select
					control={control}
					name='shooting'
					label='Where do they shoot?'
					disabled={!canEdit}
					rules={{ required: true }}
				>
					<MenuItem value={0}>They don't</MenuItem>
					<MenuItem value={1}>Low goal</MenuItem>
					<MenuItem value={2}>High goal</MenuItem>
					<MenuItem value={3}>Both goals</MenuItem>
				</Select>
				<Textarea
					control={control}
					name='notes'
					label='Notes'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
					Give some more insight into the team such as cycle times.
				</p>
			</FormSection>
			{Boolean(canEdit) && (
				<SubmitButton disabled={submitting === 'fetching'}>
					{submitting === 'fetching' ? (
						<CircularProgress sx={{ m: 1, ml: 0 }} size='1rem' color='inherit' />
					) : null}{' '}
					{create ? 'Submit' : 'Update'}
				</SubmitButton>
			)}
		</Form>
	);
};

export default PitForm;
