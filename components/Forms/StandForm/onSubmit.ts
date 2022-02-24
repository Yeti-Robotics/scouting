import { StandFormI } from '@/models/StandForm';
import { UserI } from '@/models/User';
import { SubmitHandler, UseFormReset } from 'react-hook-form';

type StandFormOnSubmit = (
	create: boolean,
	user: UserI | undefined,
	reset: UseFormReset<StandFormI>,
	isOffline: boolean,
) => SubmitHandler<StandFormI>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: StandFormOnSubmit = (create, user, reset, isOffline) => {
	const onCreate: SubmitHandler<StandFormI> = (data) => {
		if (!user || user.banned) return;
		if (!isOffline) {
			fetch('/api/forms/stand', {
				method: 'POST',
				body: JSON.stringify({ ...data, scouter: user.username }),
			}).then(async (res) => {
				if (res.ok) reset();
			});
		} else {
			// if user is offline
			const savedForms: StandFormI[] = JSON.parse(
				sessionStorage.getItem('standForms') || '[]', // use saved forms or a new array
			);
			savedForms.push({ ...data, scouter: user.username });
			sessionStorage.setItem('standForms', JSON.stringify(savedForms));
			reset();
		}
	};

	const onUpdate: SubmitHandler<StandFormI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		fetch('/api/forms/stand', {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	};

	return create ? onCreate : onUpdate;
};
