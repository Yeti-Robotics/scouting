import LoadingLayout from '@/components/Layout/LoadingLayout';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import SubmitButton from '../SubmitButton';
import TextInput from '../TextInput';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultMatch?: MatchI;
	canEdit?: boolean;
	id?: string;
}

const MatchForm: React.VFC<Props> = ({ create, defaultMatch, canEdit, id }) => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { handleSubmit, control } = useForm({ defaultValues: defaultMatch });

	if (!user) return <LoadingLayout />;

	if (!user.administrator) {
		return <h1>You are not authorized to use this!</h1>;
	}

	if (user.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit(create, user))}>
			{user && user.administrator && !create && id && (
				<Button
					variant='contained'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='error'
					onClick={() => {
						fetch(`/api/matches/${id}`, { method: 'DELETE' }).then((res) => {
							if (res.ok) router.push('/casino/matches');
						});
					}}
				>
					<Delete />
				</Button>
			)}
			<FormSection title='Info'>
				<Box sx={{ display: 'flex' }}>
					<div style={{ margin: '0.5rem' }}>
						<TextInput
							control={control}
							name='blue1'
							label='Blue 1'
							type='number'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<TextInput
							control={control}
							name='blue2'
							label='Blue 2'
							type='number'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<TextInput
							control={control}
							name='blue3'
							label='Blue 3'
							type='number'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
					</div>
					<div style={{ margin: '0.5rem' }}>
						<TextInput
							control={control}
							name='red1'
							label='Red 1'
							type='number'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<TextInput
							control={control}
							name='red2'
							label='Red 2'
							type='number'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<TextInput
							control={control}
							name='red3'
							label='Red 3'
							type='number'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
					</div>
				</Box>
				<TextInput
					control={control}
					name='startTime'
					label='Start Time'
					type='datetime-local'
					rules={{ required: true }}
				/>
			</FormSection>
			{!create && <Button type='button'>Close Bets</Button>}
			<SubmitButton>{create ? 'Submit' : 'Update'}</SubmitButton>
		</Form>
	);
};

export default MatchForm;
