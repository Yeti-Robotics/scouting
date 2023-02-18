import { useUser } from '@/lib/useUser';
import { Box, Button, Paper, PasswordInput, Text, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormSchema {
	username: string;
	password: string;
}

export const LoginForm = () => {
	const router = useRouter();
	const { mutate } = useUser({ canRedirect: false });
	const { handleSubmit, register } = useForm<FormSchema>();
	const [loginSuccess, setLoginSuccess] = useState<boolean>();

	const onSubmit = async (data: FormSchema) => {
		setLoginSuccess(undefined);
		const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
		if (res.ok) {
			mutate();
			router.push(String(router.query.from || '/'));
		}
		setLoginSuccess(false);
	};

	return (
		<Paper withBorder shadow='xl'>
			<Box
				component='form'
				p='md'
				sx={{ display: 'flex', flexDirection: 'column' }}
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextInput label='Username' {...register('username', { required: true })} />
				<PasswordInput label='Password' {...register('password', { required: true })} />
				<Button mt='md' type='submit'>
					Submit
				</Button>
				{loginSuccess !== undefined && !loginSuccess && (
					<Text style={{ color: 'red', fontSize: '1rem' }}>
						Username or password incorrect
					</Text>
				)}
			</Box>
		</Paper>
	);
};
