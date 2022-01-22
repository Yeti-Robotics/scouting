import { StandFormI } from '@/models/StandForm';
import { UserI } from '@/models/User';
import { SubmitHandler, UseFormReset } from 'react-hook-form';

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: (
	create: boolean,
	user: UserI,
	reset: UseFormReset<StandFormI>,
) => SubmitHandler<StandFormI> = (create, user, reset) => {
	const onCreate: SubmitHandler<StandFormI> = (data, e) => {
		console.log(data);
		fetch('/api/forms/stand', {
			method: 'POST',
			body: JSON.stringify({ ...data, scouter: user.username }),
		}).then(async (res) => {
			if (res.ok) reset();
		});
	};

	const onUpdate: SubmitHandler<StandFormI> = (data, e) => {
		console.log(data);
	};

	return create ? onCreate : onUpdate;
};
