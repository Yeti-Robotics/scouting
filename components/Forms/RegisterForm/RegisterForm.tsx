import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../FormSection';
import SubmitButton from '../SubmitButton';
import TextInput from '../TextInput';

interface FormSchema {
	firstName: string;
	lastName: string;
	username: string;
	password: string;
	confPassword: string;
	teamNumber: number;
}

const RegisterForm = () => {
	const router = useRouter();
	const { handleSubmit, control, watch } = useForm<FormSchema>({ mode: 'all' });
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
			async (res) => {
				if (res.ok) setUsernameIsValid(true);
				else setUsernameIsValid(false);
			},
		);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormSection title='Register'>
					<TextInput
						control={control}
						name='firstName'
						label='First Name'
						rules={{ required: true }}
					/>
					<TextInput
						control={control}
						name='lastName'
						label='Last Name'
						rules={{ required: true }}
					/>
					<TextInput
						control={control}
						name='username'
						label={
							usernameIsValid === undefined && usernameIsValid !== null
								? // if is undefined and not null it is loading state
								  'Validating...'
								: usernameIsValid || usernameIsValid === null
								? // if is null or valid shows Username
								  'Username'
								: 'Username is taken'
						}
						rules={{
							required: true,
							minLength: 3,
							validate: () => Boolean(usernameIsValid),
						}}
						onChange={validateUsername}
					/>
					<TextInput
						control={control}
						name='password'
						label='Password'
						type='password'
						rules={{ required: true, minLength: 6 }}
					/>
					<TextInput
						control={control}
						name='confPassword'
						label='Confirm Password'
						type='password'
						rules={{
							required: true,
							minLength: 6,
							validate: (v) => v === password,
						}}
					/>
					<TextInput
						control={control}
						name='teamNumber'
						label='Team Number'
						type='number'
						rules={{ required: true }}
					/>
					<SubmitButton>Submit</SubmitButton>
				</FormSection>
			</form>
		</>
	);
};

export default RegisterForm;
