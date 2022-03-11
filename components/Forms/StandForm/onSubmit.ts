import { StandFormI } from '@/models/StandForm';
import { UserI } from '@/models/User';
import { SubmitHandler, UseFormReset } from 'react-hook-form';

type StandFormOnSubmit = (
	create: boolean,
	user: UserI | undefined,
	reset: UseFormReset<StandFormI>,
	isOffline: boolean,
	setSubmitting: React.Dispatch<React.SetStateAction<'' | 'fetching' | 'done'>>,
) => SubmitHandler<StandFormI>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: StandFormOnSubmit = (create, user, reset, isOffline, setSubmitting) => {
	const onCreate: SubmitHandler<StandFormI> = (data) => {
		if (!user || user.banned) return;
		if (!isOffline) {
			setSubmitting('fetching');
			fetch('/api/forms/stand', {
				method: 'POST',
				body: JSON.stringify({ ...data, scouter: user.username }),
			}).then(async (res) => {
				setSubmitting('done');
				if (res.ok) reset();
			});
		} else {
			setSubmitting('fetching');
			// if user is offline
			const savedForms: StandFormI[] = JSON.parse(
				sessionStorage.getItem('standForms') || '[]', // use saved forms or a new array
			);
			savedForms.push({ ...data, scouter: user.username });
			sessionStorage.setItem('standForms', JSON.stringify(savedForms));
			setSubmitting('done');
			reset();
		}
	};

	const onUpdate: SubmitHandler<StandFormI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		setSubmitting('fetching');
		fetch('/api/forms/stand', {
			method: 'PATCH',
			body: JSON.stringify(data),
		}).then(() => setSubmitting('done'));
	};

	return create ? onCreate : onUpdate;
};
