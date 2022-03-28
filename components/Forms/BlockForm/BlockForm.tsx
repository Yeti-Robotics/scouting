import fetcher from '@/lib/fetch';
import { numToDateTimeInput } from '@/lib/formatDate';
import { useUser } from '@/lib/useUser';
import { ScheduleBlockI } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import Delete from '@mui/icons-material/Delete';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Autocomplete from '../Autocomplete';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import SubmitButton from '../SubmitButton';
import TextInput from '../TextInput';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultBlock: ScheduleBlockI;
	canEdit?: boolean;
	id?: string;
}

const BlockForm: React.VFC<Props> = ({ create, defaultBlock, canEdit, id }) => {
	const router = useRouter();
	const { data: users } = useSWR<UserI[]>('/api/auth/users?normal=true', fetcher);
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { control, handleSubmit } = useForm<ScheduleBlockI>({
		defaultValues: {
			...defaultBlock,
			startTime: numToDateTimeInput(defaultBlock.startTime) as any,
			endTime: numToDateTimeInput(defaultBlock.endTime) as any,
		},
	});

	if (!user || !users) return <CircularProgress />;
	const options = users.map((user) => ({
		username: user.username,
		_id: user._id,
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
						fetch(`/api/schedule/${id}`, { method: 'DELETE' }).then((res) => {
							if (res.ok) router.push('/casino/matches');
						});
					}}
				>
					<Delete />
				</Button>
			)}
			<FormSection title='Info'>
				<Autocomplete
					options={options}
					control={control}
					isOptionEqualToValue={(opt, v) => opt.username === v.username}
					getOptionLabel={(opt) =>
						opt.firstName
							? `${opt.firstName} ${opt.lastName} (${opt.username})`
							: opt.label
					}
					name='blue1'
					label='Blue 1'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<Autocomplete
					options={options}
					control={control}
					isOptionEqualToValue={(opt, v) => opt.username === v.username}
					getOptionLabel={(opt) =>
						opt.firstName
							? `${opt.firstName} ${opt.lastName} (${opt.username})`
							: opt.label
					}
					name='blue2'
					label='Blue 2'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<Autocomplete
					options={options}
					control={control}
					isOptionEqualToValue={(opt, v) => opt.username === v.username}
					getOptionLabel={(opt) =>
						opt.firstName
							? `${opt.firstName} ${opt.lastName} (${opt.username})`
							: opt.label
					}
					name='blue3'
					label='Blue 3'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<Autocomplete
					options={options}
					control={control}
					isOptionEqualToValue={(opt, v) => opt.username === v.username}
					getOptionLabel={(opt) =>
						opt.firstName
							? `${opt.firstName} ${opt.lastName} (${opt.username})`
							: opt.label
					}
					name='red1'
					label='Red 1'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<Autocomplete
					options={options}
					control={control}
					isOptionEqualToValue={(opt, v) => opt.username === v.username}
					getOptionLabel={(opt) =>
						opt.firstName
							? `${opt.firstName} ${opt.lastName} (${opt.username})`
							: opt.label
					}
					name='red2'
					label='Red 2'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<Autocomplete
					options={options}
					control={control}
					isOptionEqualToValue={(opt, v) => opt.username === v.username}
					getOptionLabel={(opt) =>
						opt.firstName
							? `${opt.firstName} ${opt.lastName} (${opt.username})`
							: opt.label
					}
					name='red3'
					label='Red 3'
					disabled={!canEdit}
					rules={{ required: false, validate: undefined }}
				/>
				<TextInput
					control={control}
					name='startTime'
					label='Start Time'
					type='datetime-local'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<TextInput
					control={control}
					name='endTime'
					label='End Time'
					type='datetime-local'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
			</FormSection>
			<SubmitButton disabled={!canEdit}>{create ? 'Submit' : 'Update'}</SubmitButton>
		</Form>
	);
};

export default BlockForm;
