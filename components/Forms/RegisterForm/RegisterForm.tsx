import { IconBrandDiscord } from '@tabler/icons-react';
import { Button, Paper, PasswordInput, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormSchema {
	firstName: string;
	lastName: string;
	username: string;
	password: string;
	confPassword: string;
	teamNumber: number;
	discordId: string;
}

const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_URI;

export const RegisterForm = () => {
	const router = useRouter();
	const {
		handleSubmit,
		register,
		watch,
		getValues,
		formState: { isValid },
	} = useForm<FormSchema>({
		mode: 'all',
	});
	console.log();
	const [usernameIsValid, setUsernameIsValid] = useState<boolean | null | undefined>(null);

	const password = watch('password');

	const onSubmit = async (data: FormSchema) => {
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		if (res.ok) router.push(String(router.query.from || '/'));
	};

	const validateUsername = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setUsernameIsValid(undefined);
		fetch('/api/auth/validate-username', { method: 'POST', body: e.target.value }).then(
			(res) => {
				if (res.ok) setUsernameIsValid(true);
				else setUsernameIsValid(false);
			},
		);
	};

	return (
		<>
			<Paper
				component='form'
				withBorder
				shadow='xl'
				p='md'
				style={{ display: 'flex', flexDirection: 'column' }}
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextInput label='First Name' {...register('firstName', { required: true })} />
				<TextInput label='Last Name' {...register('lastName', { required: true })} />
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
						validate: () => Boolean(usernameIsValid),
					})}
					onChange={validateUsername}
				/>
				<PasswordInput
					label='Password'
					type='password'
					{...register('password', { required: true, minLength: 6 })}
				/>
				<TextInput
					label='Confirm Password'
					type='password'
					{...register('confPassword', {
						required: true,
						minLength: 6,
						validate: (v) => v === password,
					})}
				/>
				<TextInput
					label='Team Number'
					type='number'
					{...register('teamNumber', { required: true, min: 1 })}
				/>
				<Button
					mt='md'
					component='a'
					href={REDIRECT_URI + `&state=${JSON.stringify(getValues())}`}
					disabled={!isValid}
					leftIcon={<IconBrandDiscord stroke={1.5} />}
					color='indigo'
				>
					Link Discord
				</Button>
			</Paper>
		</>
	);
};
