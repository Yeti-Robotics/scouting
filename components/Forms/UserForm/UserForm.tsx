import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { IconTrash } from '@tabler/icons-react';
import {
	Button,
	Loader,
	Checkbox,
	TextInput,
	PasswordInput,
	Box,
	Stack,
	ActionIcon,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { onSubmit } from './onSubmit';
import { ControlledNumberInput } from '../ControlledNumberInput';
import { openWarningModal } from '@/lib/warningModal';

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
	const { handleSubmit, register, control, watch } = useForm<
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
		return <Loader size='xl' />;
	}

	if (!user.administrator) {
		return <h1>You are not authorized to use this!</h1>;
	}

	if (user.banned) {
		return <h1>You&#39;ve been banned.</h1>;
	}

	return (
		<Box component='form' onSubmit={handleSubmit(onSubmit(create, user, setSubmitting))}>
			{user && user.administrator && !create && id && (
				<ActionIcon
					variant='filled'
					size='xl'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='error'
					onClick={() => {
						openWarningModal({
							route: `/api/auth/users/${id}`,
							method: 'DELETE',
							onRes: (res) => res.ok && router.push('/records/users'),
						});
					}}
				>
					<IconTrash />
				</ActionIcon>
			)}
			<Stack spacing='sm'>
				<TextInput
					label={
						usernameIsValid === undefined
							? // if is undefined and not null it is loading state
							  'Validating...'
							: usernameIsValid || usernameIsValid === null
							? // if is null or valid shows Username because it is valid or hasnt checked yet
							  'Username'
							: 'Username is taken'
					}
					required
					{...register('username', {
						required: true,
						minLength: 3,
						validate: (v) => {
							if (v === defaultUser?.username) return true;
							return Boolean(usernameIsValid !== undefined);
						},
					})}
					onChange={validateUsername}
				/>
				<TextInput
					label='First Name'
					disabled={!canEdit}
					required
					{...register('firstName', {
						required: true,
					})}
				/>
				<TextInput
					label='Last Name'
					disabled={!canEdit}
					required
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
						required: !!newPassword,
						minLength: !newPassword ? undefined : 6,
						validate: !newPassword ? undefined : (v) => v === newPassword,
					})}
				/>
				<TextInput
					label='Team Number'
					type='number'
					required
					{...register('teamNumber', {
						required: true,
						min: 1,
					})}
				/>
				<ControlledNumberInput label='Coins' name='coins' control={control} required />
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
