import fetcher from '@/lib/fetch';
import { numToDateTimeInput } from '@/lib/formatDate';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Delete } from '@mui/icons-material';
import { Button, CircularProgress, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Autocomplete from '../Autocomplete';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import Select from '../Select';
import SubmitButton from '../SubmitButton';
import TextInput from '../TextInput';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultMatch?: MatchI;
	canEdit?: boolean;
	id?: string;
}

export type FormMatch = Omit<MatchI, 'startTime'> & { startTime: string };

const MatchForm: React.VFC<Props> = ({ create, defaultMatch, canEdit, id }) => {
	const router = useRouter();
	const [closing, setClosing] = useState<'' | 'fetching' | 'done'>('');
	const { data: users } = useSWR<UserI[]>('/api/auth/users?normal=true', fetcher);
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { handleSubmit, control, watch } = useForm<FormMatch>({
		defaultValues: {
			...defaultMatch,
			startTime: defaultMatch?.startTime
				? numToDateTimeInput(defaultMatch.startTime)
				: undefined,
		},
	});
	const winner = watch('winner');

	if (!user || !users) return <CircularProgress />;
	const options = users.map((user) => ({
		username: user.username,
		label: `${user.firstName} ${user.lastName} (${user.username})`,
	}));

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
				<Box sx={{ display: 'flex', width: '100%' }}>
					<div style={{ width: '100%', margin: '0.5rem' }}>
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
					<div style={{ width: '100%', margin: '0.5rem' }}>
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
				<h2 style={{ marginBottom: 0 }}>Scouters</h2>
				<Box sx={{ display: 'flex', width: '100%' }}>
					<div style={{ width: '100%', margin: '0.5rem' }}>
						<Autocomplete
							options={options}
							control={control}
							isOptionEqualToValue={(opt, v) =>
								opt.username === v.username || opt.username === v
							}
							name='scouters.blue1'
							label='Blue 1'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<Autocomplete
							options={options}
							control={control}
							isOptionEqualToValue={(opt, v) =>
								opt.username === v.username || opt.username === v
							}
							name='scouters.blue2'
							label='Blue 2'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<Autocomplete
							options={options}
							control={control}
							isOptionEqualToValue={(opt, v) =>
								opt.username === v.username || opt.username === v
							}
							name='scouters.blue3'
							label='Blue 3'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
					</div>
					<div style={{ width: '100%', margin: '0.5rem' }}>
						<Autocomplete
							options={options}
							control={control}
							isOptionEqualToValue={(opt, v) =>
								opt.username === v.username || opt.username === v
							}
							name='scouters.red1'
							label='Red 1'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<Autocomplete
							options={options}
							control={control}
							isOptionEqualToValue={(opt, v) =>
								opt.username === v.username || opt.username === v
							}
							name='scouters.red2'
							label='Red 2'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
						<Autocomplete
							options={options}
							control={control}
							isOptionEqualToValue={(opt, v) =>
								opt.username === v.username || opt.username === v
							}
							name='scouters.red3'
							label='Red 3'
							disabled={!canEdit}
							rules={{ required: true, min: 1 }}
						/>
					</div>
				</Box>
				<TextInput
					control={control}
					name='matchNumber'
					label='Match Number'
					valueAsNumber
					rules={{ required: true, min: 1 }}
				/>
				<TextInput
					control={control}
					name='startTime'
					label='Start Time'
					type='datetime-local'
					rules={{ required: true }}
				/>
				{!create && (
					<Select
						control={control}
						name='winner'
						label='Winner'
						rules={{ required: false, validate: undefined }}
					>
						<MenuItem value='blue'>Blue Alliance</MenuItem>
						<MenuItem value='red'>Red Alliance</MenuItem>
						<MenuItem value='tie'>Tie or No Winner</MenuItem>
					</Select>
				)}
			</FormSection>
			{!create && defaultMatch?.open && (
				<Button
					type='button'
					variant='contained'
					onClick={() => {
						if (!winner) return;
						setClosing('fetching');
						fetch(`/api/matches/${id}/close?winner=${winner}`).then((res) => {
							setClosing('done');
							if (!res.ok) console.error('failed to close match.');
						});
					}}
				>
					{closing === 'fetching' && (
						<CircularProgress size='1rem' color='inherit' sx={{ m: 1, ml: 0 }} />
					)}{' '}
					Close Bets
				</Button>
			)}
			<SubmitButton>{create ? 'Submit' : 'Update'}</SubmitButton>
		</Form>
	);
};

export default MatchForm;
