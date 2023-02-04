import { useUser } from '@/lib/useUser';
import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';

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
		<Box>
			<form style={{ padding: '1rem' }} onSubmit={handleSubmit(onSubmit)}>
				<FormSection title='Login'>
					<TextInput label='Username' {...register('username', { required: true })} />
					<PasswordInput
						label='Password'
						type='password'
						{...register('password', { required: true })}
					/>
					<Button type='submit'>Submit</Button>
					{loginSuccess !== undefined && !loginSuccess && (
						<p style={{ color: 'red', fontSize: '1rem' }}>
							Username or password incorrect
						</p>
					)}
				</FormSection>
			</form>
		</Box>
	);
};
