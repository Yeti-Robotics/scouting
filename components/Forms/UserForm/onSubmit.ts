import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';

type UserFormOnSubmit = (
	create: boolean,
	user: UserI,
) => SubmitHandler<UserI & { newPassword: string }>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: UserFormOnSubmit = (create, user) => {
	const onCreate: SubmitHandler<UserI & { newPassword: string }> = () => {
		console.log('Not implemented :P');
	};

	const onUpdate: SubmitHandler<UserI & { newPassword: string }> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		const { password, ...withoutPass } = data;
		fetch('/api/auth/users', {
			method: 'PATCH',
			body: JSON.stringify(withoutPass),
		});
	};

	return create ? onCreate : onUpdate;
};
