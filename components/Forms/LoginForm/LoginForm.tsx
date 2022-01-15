import { Box } from '@mui/material';
import { useRouter } from 'next/router';
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

	const onSubmit = async (data: FormSchema) => {
		const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
		if (res.ok) router.push(String(router.query.from || '/'));
	};

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
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
				</FormSection>
			</form>
		</Box>
	);
};

export default LoginForm;
