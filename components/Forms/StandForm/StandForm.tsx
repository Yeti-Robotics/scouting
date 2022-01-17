import { useUser } from '@/lib/useUser';
import { StandFormI } from '@/models/StandForm';
import { Box, CircularProgress, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import Checkbox from '../Checkbox';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import ScoreInput from '../ScoreInput';
import Select from '../Select';
import SubmitButton from '../SubmitButton';
import Textarea from '../Textarea';
import TextInput from '../TextInput';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
}

const StandForm: React.VFC<Props> = ({ create }) => {
	const { user } = useUser();
	const { control, handleSubmit } = useForm<StandFormI>();

	if (!user) {
		return <CircularProgress />;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit(create, user))}>
			<h1 style={{ textAlign: 'center' }}>ALL FIELDS ARE REQUIRED</h1>
			<FormSection title='Match Info'>
				<TextInput
					control={control}
					name='matchNumber'
					label='Match Number'
					type='number'
					rules={{ required: true, min: 1 }}
				/>
				<TextInput
					control={control}
					name='teamNumber'
					label='Team Number'
					type='number'
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
						rules={{ required: true }}
						size='medium'
					/>
					<Checkbox
						control={control}
						name='initiationLine'
						label='Did they cross the line?'
						rules={{ required: true }}
						size='medium'
					/>
				</Box>
				<ScoreInput
					control={control}
					name='autoUpperBallsScored'
					label='Upper Balls Scored'
				/>
				<ScoreInput
					control={control}
					name='autoUpperBallsMissed'
					label='Upper Balls Missed'
				/>
				<ScoreInput control={control} name='autoLowBallsScored' label='Low Balls Scored' />
				<ScoreInput control={control} name='autoLowBallsMissed' label='Low Balls Missed' />
			</FormSection>
			<FormSection title='Teleop'>
				<ScoreInput
					control={control}
					name='teleopUpperBallsScored'
					label='Upper Balls Scored'
				/>
				<ScoreInput
					control={control}
					name='teleopUpperBallsMissed'
					label='Upper Balls Missed'
				/>
				<ScoreInput
					control={control}
					name='teleopLowBallsScored'
					label='Low Balls Scored'
				/>
				<ScoreInput
					control={control}
					name='teleopLowBallsMissed'
					label='Low Balls Missed'
				/>
			</FormSection>
			<FormSection title='Misc.'>
				<Select
					control={control}
					name='endPosition'
					label='End Position'
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
					rules={{ required: true }}
				>
					<MenuItem value={0}>1</MenuItem>
					<MenuItem value={1}>2</MenuItem>
					<MenuItem value={2}>3</MenuItem>
					<MenuItem value={3}>4</MenuItem>
					<MenuItem value={4}>5</MenuItem>
				</Select>
				<ScoreInput control={control} name='penalties' label='# of penalties' />
				<Textarea
					control={control}
					name='notes'
					label='Notes'
					placeholder="Give some more insight into the match such as: strategy, robot status (disabled, broken), and human players. Don't write too much, be concise!"
					rules={{ required: true }}
				/>
			</FormSection>
			<SubmitButton>Submit</SubmitButton>
		</Form>
	);
};

export default StandForm;
