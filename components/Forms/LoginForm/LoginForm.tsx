import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';
import SubmitButton from '../SubmitButton';
import TextInput from '../TextInput';

interface FormSchema {
	username: string;
	password: string;
}

const LoginForm = () => {
	const router = useRouter();
	const { handleSubmit, control } = useForm<FormSchema>();
	const [loginSuccess, setLoginSuccess] = useState<boolean>();

	const onSubmit = async (data: FormSchema) => {
		setLoginSuccess(undefined);
		const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
		if (res.ok) router.push(String(router.query.from || '/'));
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
					<SubmitButton>Submit</SubmitButton>
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
