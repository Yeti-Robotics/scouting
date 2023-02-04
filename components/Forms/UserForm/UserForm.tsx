import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { IconTrash } from '@tabler/icons-react';
import { Button, Loader, Checkbox, TextInput, PasswordInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultUser?: UserI;
	canEdit?: boolean;
	id?: string;
}

const UserForm = ({ create, defaultUser, canEdit, id }: Props) => {
	const router = useRouter();
	const { user } = useUser({ redirectIfNotAdmin: true });
	const { handleSubmit, register, watch } = useForm<
		UserI & { newPassword: string; confPassword: string }
	>({
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
		return <Loader />;
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
					<IconTrash />
				</Button>
			)}
			<FormSection title='Info'>
				<TextInput
					label={
						usernameIsValid === undefined && usernameIsValid !== null
							? // if is undefined and not null it is loading state
							  'Validating...'
							: usernameIsValid || usernameIsValid === null
							? // if is null or valid shows Username
							  'Username'
							: 'Username is taken'
					}
					{...register('username', {
						required: true,
						minLength: 3,
						validate: (v) => {
							if (v === defaultUser?.username) return true;
							return Boolean(usernameIsValid);
						},
					})}
					onChange={validateUsername}
				/>
				<TextInput
					label='First Name'
					disabled={!canEdit}
					{...register('firstName', {
						required: true,
					})}
				/>
				<TextInput
					label='Last Name'
					disabled={!canEdit}
					{...register('lastName', {
						required: true,
					})}
				/>
				<PasswordInput
					label='New Password'
					type='password'
					{...register('newPassword', {
						required: false,
						validate: undefined,
						minLength: 6,
					})}
				/>
				<PasswordInput
					label='Confirm Password'
					type='password'
					{...register('confPassword', {
						required: newPassword !== '',
						minLength: 6,
						validate: (v) => v === newPassword,
					})}
				/>
				<TextInput
					label='Team Number'
					type='number'
					{...register('teamNumber', {
						required: true,
						min: 1,
					})}
				/>
				<TextInput
					label='Coins'
					type='number'
					{...register('coins', {
						required: true,
					})}
				/>
				<Checkbox {...register('administrator')} />
				<Checkbox {...register('banned')} />
			</FormSection>
			{Boolean(canEdit) && <Button type='submit'>{create ? 'Submit' : 'Update'}</Button>}
		</Form>
	);
};

export default UserForm;
