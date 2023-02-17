import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { CreateStandForm } from '@/models/StandForm';
import { IconTrash } from '@tabler/icons-react';
import { Box, Button, Loader, Checkbox, Textarea, Stack, Text, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import FormSection from '../FormSection';
import { ScoreInput } from '../ScoreInput';
import { onSubmit } from './onSubmit';
import { setOnline } from './setOnline';
import { NumberSelect } from '../NumberSelect';
import { NumberAutocomplete } from '../NumberAutocomplete';
import { ControlledNumberInput } from '../ControlledNumberInput';
import { notifications } from '@mantine/notifications';
import { defaultValues } from './defaultValues';

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
	].filter((team) => team.value !== undefined) as { label: string; value: number }[];

export const StandForm = ({ create, canEdit, defaultForm, id }: Props) => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const [isOffline, setIsOffline] = useState(false);
	const [approving, setApproving] = useState<'' | 'fetching' | 'done'>('');
	const [submitting, setSubmitting] = useState<'' | 'fetching' | 'done'>('');
	const [match, setMatch] = useState<MatchI | null>(null);
	const { data: matches } = useSWR<MatchI[]>('/api/matches', fetcher);
	const { register, control, handleSubmit, reset, setValue, watch } = useForm<CreateStandForm>({
		defaultValues: {
			...defaultValues,
			...defaultForm,
		},
	});
	const matchNumber = watch('matchNumber');
	const autoDocked = watch('autoDocked');
	const teleopDocked = watch('teleopDocked');

	const handleOnline = useCallback(
		() => setOnline(isOffline, setIsOffline)(),
		[isOffline, setIsOffline],
	);

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

	useEffect(() => {
		if (isOffline)
			notifications.show({
				title: isOffline ? 'You went offline 😔' : 'Back online 😁',
				message: isOffline
					? 'You just went offline. Any forms you submit will be saved on your device and submitted when you have an internet connection. Be sure to keep this page open. Click me to dismiss.'
					: 'You are back online, any forms you may have submitted while offline were automagically submitted. Click me to dismiss.',
				autoClose: 10000,
			});
	}, [isOffline]);

	if (!user && create) {
		return <Loader />;
	}
	//const matchOptions = matches.filter((match) => userIsScouting(user, match));

	if (create && user?.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit(onSubmit(create, user, reset, isOffline, setSubmitting))}
		>
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
					<IconTrash />
				</Button>
			)}
			<Stack align='flex'>
				<FormSection title='Match Info'>
					<ControlledNumberInput
						label='Match Number'
						disabled={!canEdit}
						required
						control={control}
						name='matchNumber'
						hideControls
					/>
					<NumberAutocomplete
						control={control}
						name='teamNumber'
						label='Team Number'
						data={getTeamsAsArr(match)}
						disabled={!canEdit}
						required
					/>
				</FormSection>
				<FormSection title='Autonomous'>
					<Stack pb='md'>
						<Checkbox
							{...register('preload')}
							label='Preloaded?'
							size='xl'
							disabled={!canEdit}
						/>
						<Checkbox
							{...register('initiationLine')}
							label='Did they leave their box?'
							size='xl'
							disabled={!canEdit}
						/>
					</Stack>
					<ScoreInput
						control={control}
						name='autoTopCones'
						label='Top Cones Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='autoTopCubes'
						label='Top Cubes Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='autoMidCones'
						label='Mid Cones Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='autoMidCubes'
						label='Mid Cubes Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='autoLowCones'
						label='Low Cones Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='autoLowCubes'
						label='Low Cubes Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<Stack mt='md'>
						<Checkbox
							{...register('autoDocked')}
							label='On charger'
							size='xl'
							disabled={!canEdit}
						/>
						{autoDocked && (
							<Checkbox
								{...register('autoEngaged')}
								label='On charger and balanced'
								size='xl'
								disabled={!canEdit}
							/>
						)}
					</Stack>
				</FormSection>
				<FormSection title='Teleop'>
					<ScoreInput
						control={control}
						name='teleopTopCones'
						label='Top Cones Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='teleopTopCubes'
						label='Top Cubes Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='teleopMidCones'
						label='Mid Cones Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='teleopMidCubes'
						label='Mid Cubes Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='teleopLowCones'
						label='Low Cones Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<ScoreInput
						control={control}
						name='teleopLowCubes'
						label='Low Cubes Scored'
						disabled={!canEdit}
						min={0}
						required
					/>
					<Stack mt='md'>
						<Checkbox
							{...register('teleopDocked')}
							label='On charger'
							size='xl'
							disabled={!canEdit}
						/>
						{teleopDocked && (
							<Checkbox
								{...register('teleopEngaged')}
								label='On charger and balanced'
								size='xl'
								disabled={!canEdit}
							/>
						)}
					</Stack>
					{teleopDocked && (
						<ScoreInput
							control={control}
							name='numberOnCharger'
							label='Number of Robots on Charger'
							disabled={!canEdit}
							min={0}
							max={3}
							required
						/>
					)}
				</FormSection>
				<FormSection title='Misc.'>
					<ScoreInput
						control={control}
						name='links'
						label='# of Links'
						disabled={!canEdit}
						min={0}
						required
					/>
					<NumberSelect
						control={control}
						data={[
							{ label: 'No Defense', value: 0 },
							{ label: '1 - Many Penalties', value: 1 },
							{ label: '2 - Few Penalties', value: 2 },
							{ label: '3 - Pretty Effective', value: 3 },
							{ label: '4 - Very Effective', value: 4 },
							{ label: '5 - Perfect', value: 5 },
						]}
						name='defense'
						label='Rate Defense'
						disabled={!canEdit}
						required
					/>
					<ScoreInput
						control={control}
						name='penalties'
						label='# of penalties'
						min={0}
						disabled={!canEdit}
					/>
					<Textarea
						label='Notes'
						disabled={!canEdit}
						{...register('notes', { required: true })}
						required
					/>
					<Text>
						Give some more insight into the match such as: strategy, robot status
						(disabled, broken), and human players. Don't write too much, be concise!
					</Text>
				</FormSection>
			</Stack>

			<Group position='center' mt='md'>
				{Boolean(canEdit) && !create && !defaultForm?.approved && (
					<Button
						type='button'
						color='green'
						variant='contained'
						m='md'
						loading={approving === 'fetching'}
						onClick={() => {
							setApproving('fetching');
							fetch(`/api/forms/stand/${id}/approve`).finally(() =>
								setApproving('done'),
							);
						}}
					>
						Approve
					</Button>
				)}
				{(create || Boolean(canEdit)) && (
					<Button
						type='submit'
						disabled={submitting === 'fetching'}
						loading={submitting === 'fetching'}
					>
						{create ? 'Submit' : 'Update'}
					</Button>
				)}
			</Group>
		</Box>
	);
};
