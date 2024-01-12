import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { CreateStandForm } from '@/models/StandForm';
import { IconTrash } from '@tabler/icons-react';
import {
	Box,
	Button,
	Loader,
	Checkbox,
	Textarea,
	Stack,
	Text,
	ActionIcon,
	Group,
} from '@mantine/core';
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
import { openWarningModal } from '@/lib/warningModal';
import { Cone, Cube } from '../../icons';

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
	const climb = watch('climb');

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
		if (climb === false) {
			setValue('spotlight', false);
		}
	}, [climb]);

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
				<ActionIcon
					variant='filled'
					size='xl'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='red'
					onClick={() => {
						openWarningModal({
							route: `/api/forms/stand/${id}`,
							method: 'delete',
							onRes: (res) => res.ok && router.push('/records/stand-forms'),
						});
					}}
				>
					<IconTrash />
				</ActionIcon>
			)}
			<Stack align='flex' mx='md'>
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
						limit={6}
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
							label='Did they go past the white line?'
							size='xl'
							disabled={!canEdit}
						/>
					</Stack>
					<Group align='center'>
						<Cone />
						<ScoreInput
							control={control}
							name='autoSpeakerNotes'
							label='Speaker Notes Scored'
							disabled={!canEdit}
							min={0}
							required
						/>
					</Group>
					<Group align='center'>
						<Cube />
						<ScoreInput
							control={control}
							name='autoAmpNotes'
							label='Amp Notes Scored'
							disabled={!canEdit}
							min={0}
							required
						/>
					</Group>
				</FormSection>
				<FormSection title='Teleop'>
					<Group align='center'>
						<Cone />
						<ScoreInput
							control={control}
							name='teleopAmpNotes'
							label='Amp Notes Scored'
							disabled={!canEdit}
							min={0}
							required
						/>
					</Group>
					<Group align='center'>
						<Cube />
						<ScoreInput
							control={control}
							name='teleopSpeakerNotes'
							label='Speaker Notes Scored'
							disabled={!canEdit}
							min={0}
							required
						/>
					</Group>
					<Group align='center'>
						<Cone />
						<ScoreInput
							control={control}
							name='teleopAmplifiedSpeakerNotes'
							label='Amped Speaker Notes Scored'
							disabled={!canEdit}
							min={0}
							required
						/>
					</Group>
				</FormSection>
				<FormSection title='EndGame'>
					<Group>
						<ScoreInput
							control={control}
							name='trapNotes'
							label='Trap Notes Scored'
							disabled={!canEdit}
							min={0}
							required
						/>
					</Group>
					<Stack mt='md'>
						<Checkbox
							{...register('climb')}
							label='Climbed?'
							size='xl'
							disabled={!canEdit}
						/>
						{climb && (
							<Checkbox
								{...register('spotlight')}
								label='Spotlit?'
								size='xl'
								disabled={!canEdit}
							/>
						)}
						{climb && (
							<ScoreInput
								control={control}
								name='numberOnChain'
								label='# of robots on your chain'
								disabled={!canEdit}
								min={0}
								max={3}
								required
							/>
						)}
					</Stack>
				</FormSection>
				<FormSection title='Misc.'>
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

			<Stack align='center' mt='md'>
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
			</Stack>
		</Box>
	);
};
