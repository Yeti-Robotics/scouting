import fetchTimeout from '@/lib/fetchTimeout';
import { CreateStandForm } from '@/models/StandForm';

type Func = (
	isOffline: boolean,
	setIsOffline: React.Dispatch<React.SetStateAction<boolean>>,
) => () => Promise<void>;

export const setOnline: Func = (isOffline, setIsOffline) => async () => {
	const controller = new AbortController();

	const currentForms: CreateStandForm[] | false = JSON.parse(
		sessionStorage.getItem('standForms') || 'false',
	);
	const pingRes = await fetchTimeout('/api/ping', 3000, {
		signal: controller.signal,
		method: 'GET',
	})
		.then((res) => {
			return res.status ? false : true;
		})
		.catch(() => {
			return true;
		});
	if (pingRes) return;
	setIsOffline(false);
	if (currentForms) {
		currentForms.forEach((form) =>
			fetch('/api/forms/stand', {
				method: 'POST',
				body: JSON.stringify(form),
			}),
		);
		return sessionStorage.removeItem('standForms');
	}
};
