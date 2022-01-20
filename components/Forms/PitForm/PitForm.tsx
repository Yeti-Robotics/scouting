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
	defaultForm?: PitFormI & { images: PitImageI[] };
}

const PitForm: React.VFC<Props> = ({ create, defaultForm }) => {
	const { user } = useUser();
	const [images, setImages] = useState<Partial<PitImageI>[]>(defaultForm?.images || []);
	const { control, handleSubmit } = useForm<PitFormI>({ defaultValues: defaultForm });

	if (!user) {
		return <CircularProgress />;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit(create, user, images))}>
			<h1 style={{ textAlign: 'center' }}>ALL FIELDS ARE REQUIRED</h1>
			<FormSection title='Match Info'>
				<TextInput
					control={control}
					name='teamNumber'
					label='Team Number'
					type='number'
					rules={{ required: true, min: 1 }}
				/>
			</FormSection>
			<FormSection title='Images'>
				<Images state={[images, setImages]} />
			</FormSection>
			<FormSection title='Info'>
				<Select
					control={control}
					name='endPosition'
					label='Where do they end the game?'
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
					placeholder='Give some more insight into the team such as cycle times.'
					rules={{ required: true }}
				/>
			</FormSection>
			<SubmitButton>Submit</SubmitButton>
		</Form>
	);
};

export default PitForm;
