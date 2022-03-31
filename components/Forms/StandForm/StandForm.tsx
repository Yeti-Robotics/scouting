import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { CreateStandForm } from '@/models/StandForm';
import { Check, Delete } from '@mui/icons-material';
import { Box, Button, CircularProgress, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Autocomplete from '../Autocomplete';
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
	defaultForm?: Partial<CreateStandForm>;
	id?: string;
}

const getTeamsAsArr = (match: MatchI | null) =>
	[
		{ label: `Blue 1 - ${match?.blue1}`, value: match?.blue1 },
		{ label: `Blue 2 - ${match?.blue2}`, value: match?.blue2 },
		{ label: `Blue 3 - ${match?.blue3}`, value: match?.blue3 },
		{ label: `Red 1 - ${match?.red1}`, value: match?.red1 },
		{ label: `Red 2 - ${match?.red2}`, value: match?.red2 },
		{ label: `Red 3 - ${match?.red3}`, value: match?.red3 },
	].filter((team) => team.value !== undefined);
const StandForm: React.VFC<Props> = ({ create, canEdit, defaultForm, id }) => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const [isOffline, setIsOffline] = useState(false);
	const [approving, setApproving] = useState<'' | 'fetching' | 'done'>('');
	const [submitting, setSubmitting] = useState<'' | 'fetching' | 'done'>('');
	const [match, setMatch] = useState<MatchI | null>(null);
	const { data: matches } = useSWR<MatchI[]>('/api/matches', fetcher);
	const { control, handleSubmit, reset, watch } = useForm<CreateStandForm>({
		defaultValues: defaultForm,
	});
	const matchNumber = watch('matchNumber');

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

	useEffect(() => {
		if (!create || !matches || !user) return;
		setMatch(matches.find((match) => match.matchNumber === matchNumber) || null);
	}, [matchNumber]);

	if (!user && create) {
		return <CircularProgress />;
	}
	//const matchOptions = matches.filter((match) => userIsScouting(user, match));

	if (create && user?.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit(create, user, reset, isOffline, setSubmitting))}>
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
			<>
				<FormSection title='Match Info'>
					<TextInput
						control={control}
						name='matchNumber'
						label='Match Number'
						valueAsNumber
						disabled={!canEdit}
						rules={{ required: true, min: 1 }}
					/>
					<Autocomplete
						control={control}
						name='teamNumber'
						label='Team Number'
						valueAsNumber
						freeSolo
						options={getTeamsAsArr(match)}
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
							label='Did they leave their box?'
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
						<MenuItem value={0}>No Defense</MenuItem>
						<MenuItem value={1}>1 Many Penalties</MenuItem>
						<MenuItem value={2}>2 Few Penalties/Not Effective </MenuItem>
						<MenuItem value={3}>3 Pretty Effective</MenuItem>
						<MenuItem value={4}>4 Very Effective</MenuItem>
						<MenuItem value={5}>5 Perfect</MenuItem>
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
						Give some more insight into the match such as: strategy, robot status
						(disabled, broken), and human players. Don't write too much, be concise!
					</p>
				</FormSection>
			</>

			{Boolean(canEdit) && !create && !defaultForm?.approved && (
				<Button
					type='button'
					color='success'
					variant='contained'
					sx={{ m: 2 }}
					onClick={() => {
						setApproving('fetching');
						fetch(`/api/forms/stand/${id}/approve`).then(() => setApproving('done'));
					}}
				>
					{approving === 'fetching' ? (
						<CircularProgress color='inherit' sx={{ margin: 1, ml: 0 }} size='1rem' />
					) : (
						<Check sx={{ margin: 1, ml: 0 }} />
					)}{' '}
					Approve
				</Button>
			)}
			{(create || Boolean(canEdit)) && (
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

export default StandForm;
