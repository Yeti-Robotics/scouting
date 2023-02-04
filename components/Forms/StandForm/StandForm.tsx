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
import Autocomplete from '../ControlledAutocomplete';
import Checkbox from '../Checkbox';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import ScoreInput from '../ScoreInput';
import Select from '../ControlledSelect';
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
const StandForm = ({ create, canEdit, defaultForm, id }: Props) => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const [isOffline, setIsOffline] = useState(false);
	const [approving, setApproving] = useState<'' | 'fetching' | 'done'>('');
	const [submitting, setSubmitting] = useState<'' | 'fetching' | 'done'>('');
	const [match, setMatch] = useState<MatchI | null>(null);
	const { data: matches } = useSWR<MatchI[]>('/api/matches', fetcher);
	const { control, handleSubmit, reset, setValue, watch } = useForm<CreateStandForm>({
		defaultValues: defaultForm,
	});
	const matchNumber = watch('matchNumber');
	const autoDocked = watch('autoDocked');
	const teleopDocked = watch('teleopDocked');

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

	useEffect(() => {
		if (autoDocked === false) {
			setValue('autoEngaged', false);
		}
		if (teleopDocked === false) {
			setValue('teleopEngaged', false);
			setValue('numberOnCharger', 0);
		}
	}, [autoDocked, teleopDocked]);

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
						name='autoTopCones'
						label='Top Cones Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='autoTopCubes'
						label='Top Cubes Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='autoMidCones'
						label='Mid Cones Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='autoMidCubes'
						label='Mid Cubes Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='autoLowCones'
						label='Low Cones Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='autoLowCubes'
						label='Low Cubes Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
						}}
					>
						<Checkbox
							control={control}
							name='autoDocked'
							label='On charger'
							size='medium'
							disabled={!canEdit}
						/>
						{autoDocked && (
							<Checkbox
								control={control}
								name='autoEngaged'
								label='On charger and balanced'
								size='medium'
								disabled={!canEdit}
							/>
						)}
					</Box>
				</FormSection>
				<FormSection title='Teleop'>
					<ScoreInput
						control={control}
						name='teleopTopCones'
						label='Top Cones Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='teleopTopCubes'
						label='Top Cubes Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='teleopMidCones'
						label='Mid Cones Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='teleopMidCubes'
						label='Mid Cubes Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='teleopLowCones'
						label='Low Cones Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<ScoreInput
						control={control}
						name='teleopLowCubes'
						label='Low Cubes Scored'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
						}}
					>
						<Checkbox
							control={control}
							name='teleopDocked'
							label='On charger'
							size='medium'
							disabled={!canEdit}
						/>
						{teleopDocked && (
							<Checkbox
								control={control}
								name='teleopEngaged'
								label='On charger and balanced'
								size='medium'
								disabled={!canEdit}
							/>
						)}
					</Box>
					{teleopDocked && (
						<ScoreInput
							control={control}
							name='numberOnCharger'
							label='Number of Robots on Charger'
							disabled={!canEdit}
							defaultValue={0}
							max={3}
							rules={{ required: true }}
						/>
					)}
				</FormSection>
				<FormSection title='Misc.'>
					<ScoreInput
						control={control}
						name='links'
						label='# of Links'
						disabled={!canEdit}
						defaultValue={0}
						rules={{ required: true }}
					/>
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
						defaultValue={0}
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
