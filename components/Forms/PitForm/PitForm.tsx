import { useUser } from '@/lib/useUser';
import { PitFormI } from '@/models/PitForm';
import { PitImageI } from '@/models/PitImage';
import { CircularProgress, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import Select from '../Select';
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
}

const PitForm: React.VFC<Props> = ({ create, defaultForm, canEdit, defaultImages }) => {
	const { user } = useUser({ canRedirect: false });
	const [images, setImages] = useState<Partial<PitImageI & { listId: number }>[]>(
		defaultImages || [],
	);
	const { control, handleSubmit, reset } = useForm<PitFormI>({ defaultValues: defaultForm });

	if (!user && create) {
		return <CircularProgress />;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit(create, user, reset, images, setImages))}>
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
			{Boolean(canEdit) && <SubmitButton>{create ? 'Submit' : 'Update'}</SubmitButton>}
		</Form>
	);
};

export default PitForm;
