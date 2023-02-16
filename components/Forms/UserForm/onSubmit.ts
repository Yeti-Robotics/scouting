import { UserI } from '@/models/User';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler } from 'react-hook-form';

type UserFormOnSubmit = (
	create: boolean,
	user: UserI,
	setSubmitting: Dispatch<SetStateAction<'' | 'fetching' | 'done'>>,
) => SubmitHandler<UserI & { newPassword: string }>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: UserFormOnSubmit = (create, user, setSubmitting) => {
	const onCreate: SubmitHandler<UserI & { newPassword: string }> = () => {
		console.log('Not implemented :P');
	};

	const onUpdate: SubmitHandler<UserI & { newPassword: string }> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		setSubmitting('fetching');
		const { password, ...withoutPass } = data;
		fetch('/api/auth/users', {
			method: 'PATCH',
			body: JSON.stringify(withoutPass),
		}).finally(() => setSubmitting('done'));
	};

	return create ? onCreate : onUpdate;
};
