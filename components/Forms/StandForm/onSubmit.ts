import { StandFormI } from '@/models/StandForm';
import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: (create: boolean, user: UserI) => SubmitHandler<StandFormI> = (
	create,
	user,
) => {
	const onCreate: SubmitHandler<StandFormI> = (data, e) => {
		console.log(data);
		fetch('/api/forms/stand', {
			method: 'POST',
			body: JSON.stringify({ ...data, scouter: user.username }),
		}).then(async (res) => {
			res.status;
		});
	};

	const onUpdate: SubmitHandler<StandFormI> = (data, e) => {
		console.log(data);
	};

	return create ? onCreate : onUpdate;
};
