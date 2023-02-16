import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { IconTrash } from '@tabler/icons-react';
import { Button, Loader, Checkbox, TextInput, PasswordInput, Box, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultUser?: UserI;
	canEdit?: boolean;
	id?: string;
}

export const UserForm = ({ create, defaultUser, canEdit, id }: Props) => {
	const router = useRouter();
	const { user } = useUser({ redirectIfNotAdmin: true });
	const [submitting, setSubmitting] = useState<'' | 'fetching' | 'done'>('');
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
		<Box component='form' onSubmit={handleSubmit(onSubmit(create, user, setSubmitting))}>
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
			<Stack spacing='sm'>
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
					{...register('newPassword', {
						required: false,
						validate: undefined,
						minLength: 6,
					})}
				/>
				<PasswordInput
					label='Confirm Password'
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
				<Checkbox label='Administrator' {...register('administrator')} />
				<Checkbox label='Banned' {...register('banned')} />
			</Stack>
			{Boolean(canEdit) && (
				<Button
					type='submit'
					mt='md'
					fullWidth
					disabled={submitting === 'fetching'}
					loading={submitting === 'fetching'}
				>
					{create ? 'Submit' : 'Update'}
				</Button>
			)}
		</Box>
	);
};
