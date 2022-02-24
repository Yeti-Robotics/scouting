import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Delete } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import Checkbox from '../Checkbox';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import SubmitButton from '../SubmitButton';
import TextInput from '../TextInput';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultUser?: UserI;
	canEdit?: boolean;
	id?: string;
}

const UserForm: React.VFC<Props> = ({ create, defaultUser, canEdit, id }) => {
	const router = useRouter();
	const { user } = useUser({ redirectIfNotAdmin: true });
	const { handleSubmit, control, watch } = useForm<UserI & { newPassword: string }>({
		defaultValues: defaultUser,
	});
	const [usernameIsValid, setUsernameIsValid] = useState<boolean | null | undefined>(null);

	const validateUsername = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setUsernameIsValid(undefined);
		fetch('/api/auth/validate-username', { method: 'POST', body: e.target.value }).then(
			(res) => {
				if (res.ok) setUsernameIsValid(true);
				else setUsernameIsValid(false);
			},
		);
	};
	const newPassword = watch('newPassword');

	if (!user) {
		return <CircularProgress />;
	}

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
						fetch(`/api/auth/users/${id}`, { method: 'DELETE' }).then((res) => {
							if (res.ok) router.push('/records/users');
						});
					}}
				>
					<Delete />
				</Button>
			)}
			<FormSection title='Info'>
				<TextInput
					control={control}
					name='username'
					label={
						usernameIsValid === undefined && usernameIsValid !== null
							? // if is undefined and not null it is loading state
							  'Validating...'
							: usernameIsValid || usernameIsValid === null
							? // if is null or valid shows Username
							  'Username'
							: 'Username is taken'
					}
					rules={{
						required: true,
						minLength: 3,
						validate: (v) => {
							if (v === defaultUser?.username) return true;
							return Boolean(usernameIsValid);
						},
					}}
					onChange={validateUsername}
				/>
				<TextInput
					control={control}
					name='firstName'
					label='First Name'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<TextInput
					control={control}
					name='lastName'
					label='Last Name'
					disabled={!canEdit}
					rules={{ required: true }}
				/>
				<TextInput
					control={control}
					name='newPassword'
					label='New Password'
					type='password'
					rules={{ required: true, minLength: 6 }}
				/>
				<TextInput
					control={control}
					name='confPassword'
					label='Confirm Password'
					type='password'
					rules={{
						required: true,
						minLength: 6,
						validate: (v) => v === newPassword,
					}}
				/>
				<TextInput
					control={control}
					name='teamNumber'
					label='Team Number'
					type='number'
					rules={{ required: true, min: 1 }}
				/>
				<Checkbox control={control} name='administrator' />
				<Checkbox control={control} name='banned' />
			</FormSection>
			{Boolean(canEdit) && <SubmitButton>{create ? 'Submit' : 'Update'}</SubmitButton>}
		</Form>
	);
};

export default UserForm;
