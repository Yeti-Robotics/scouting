import { useUser } from '@/lib/useUser';
import { Box, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';
import TextInput from '../TextInput';

interface FormSchema {
	username: string;
	password: string;
}

const LoginForm = () => {
	const router = useRouter();
	const { mutate } = useUser({ canRedirect: false });
	const { handleSubmit, control } = useForm<FormSchema>();
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
					<TextInput
						control={control}
						name='username'
						label='Username'
						rules={{ required: true }}
					/>
					<TextInput
						control={control}
						name='password'
						label='Password'
						type='password'
						rules={{ required: true }}
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

export default LoginForm;
