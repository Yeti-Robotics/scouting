import { useUser } from '@/lib/useUser';
import { Box, Button, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormSchema {
	username: string;
	password: string;
}

export const LoginForm = ({ modal }: { modal: boolean }) => {
	const router = useRouter();
	const { mutate } = useUser({ canRedirect: false });
	const { handleSubmit, register } = useForm<FormSchema>();
	const [loginSuccess, setLoginSuccess] = useState<boolean>();

	const onSubmit = async (data: FormSchema) => {
		setLoginSuccess(undefined);
		const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
		if (res.ok) {
			await mutate();
			if (modal) closeAllModals();
			else router.push(String(router.query.from || '/'));
		}
		setLoginSuccess(false);
	};

	return (
		<Paper withBorder={!modal} shadow={!modal ? 'xl' : undefined}>
			{modal && <Title align='center'>Log Back In</Title>}
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
