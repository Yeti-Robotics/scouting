import { useUser } from '@/lib/useUser';
import { StandFormI } from '@/models/StandForm';
import { Delete } from '@mui/icons-material';
import { Box, Button, CircularProgress, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Checkbox from '../Checkbox';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import ScoreInput from '../ScoreInput';
import Select from '../Select';
import SubmitButton from '../SubmitButton';
import Textarea from '../Textarea';
import TextInput from '../TextInput';
import ConnectionIndicator from './ConnectionIndicator';
import { onSubmit } from './onSubmit';
import { setOnline } from './setOnline';

interface Props {
	create: boolean;
	canEdit?: boolean;
	defaultForm?: Partial<StandFormI>;
	id?: string;
}

const StandForm: React.VFC<Props> = ({ create, canEdit, defaultForm, id }) => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const [isOffline, setIsOffline] = useState(false);
	const { control, handleSubmit, reset } = useForm<StandFormI>({ defaultValues: defaultForm });

	const handleOnline = useCallback(() => setOnline(isOffline, setIsOffline)(), []);

	useEffect(() => {
		const setOffline = () => {
			setIsOffline(true);
		};

		window.addEventListener('offline', setOffline);
		window.addEventListener('online', handleOnline);
		return () => {
			window.removeEventListener('offline', setOffline);
			window.removeEventListener('online', handleOnline);
		};
	}, []);

	if (!user && create) {
		return <CircularProgress />;
	}

	if (user && create && user.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit(create, user, reset, isOffline))}>
			{user && user.administrator && !create && id && (
				<Button
					variant='contained'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='error'
					onClick={() => {
						fetch(`/api/forms/stand/${id}`, { method: 'delete' }).then((res) => {
							if (res.ok) router.push('/records/stand-forms');
						});
					}}
				>
					<Delete />
				</Button>
			)}
			<ConnectionIndicator isOffline={isOffline} />
			<FormSection title='Match Info'>
				<TextInput
					control={control}
					name='matchNumber'
					label='Match Number'
					type='number'
					disabled={!canEdit}
					rules={{ required: true, min: 1 }}
				/>
				<TextInput
					control={control}
					name='teamNumber'
					label='Team Number'
					type='number'
					disabled={!canEdit}
					rules={{ required: true, min: 1 }}
				/>
			</FormSection>
			<FormSection title='Autonomous'>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
					}}
				>
					<Checkbox
						control={control}
						name='preload'
						label='Preloaded?'
						size='medium'
						disabled={!canEdit}
					/>
					<Checkbox
						control={control}
						name='initiationLine'
						label='Did they cross the line?'
						size='medium'
						disabled={!canEdit}
					/>
				</Box>
				<ScoreInput
					control={control}
					name='autoUpperBallsScored'
					label='Upper Balls Scored'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<ScoreInput
					control={control}
					name='autoUpperBallsMissed'
					label='Upper Balls Missed'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<ScoreInput
					control={control}
					name='autoLowBallsScored'
					label='Low Balls Scored'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<ScoreInput
					control={control}
					name='autoLowBallsMissed'
					label='Low Balls Missed'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
			</FormSection>
			<FormSection title='Teleop'>
				<ScoreInput
					control={control}
					name='teleopUpperBallsScored'
					label='Upper Balls Scored'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<ScoreInput
					control={control}
					name='teleopUpperBallsMissed'
					label='Upper Balls Missed'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<ScoreInput
					control={control}
					name='teleopLowBallsScored'
					label='Low Balls Scored'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<ScoreInput
					control={control}
					name='teleopLowBallsMissed'
					label='Low Balls Missed'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
			</FormSection>
			<FormSection title='Misc.'>
				<Select
					control={control}
					name='endPosition'
					label='End Position'
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
					label='Rate Defense'
					disabled={!canEdit}
					rules={{ required: true }}
				>
					<MenuItem value={0}>1</MenuItem>
					<MenuItem value={1}>2</MenuItem>
					<MenuItem value={2}>3</MenuItem>
					<MenuItem value={3}>4</MenuItem>
					<MenuItem value={4}>5</MenuItem>
				</Select>
				<ScoreInput
					control={control}
					name='penalties'
					label='# of penalties'
					disabled={!canEdit}
				/>
				<Textarea
					control={control}
					name='notes'
					label='Notes'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<p>
					Give some more insight into the match such as: strategy, robot status (disabled,
					broken), and human players. Don't write too much, be concise!
				</p>
			</FormSection>
			{Boolean(canEdit) && <SubmitButton>{create ? 'Submit' : 'Update'}</SubmitButton>}
		</Form>
	);
};

export default StandForm;
