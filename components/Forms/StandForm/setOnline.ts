import fetchTimeout from '@/lib/fetchTimeout';
import { StandFormI } from '@/models/StandForm';

type Func = (
	isOffline: boolean,
	setIsOffline: React.Dispatch<React.SetStateAction<boolean>>,
) => () => Promise<void>;

export const setOnline: Func = (isOffline, setIsOffline) => async () => {
	const controller = new AbortController();
	console.log('set online runned');

	const currentForms: StandFormI[] | false = JSON.parse(
		sessionStorage.getItem('standForms') || 'false',
	);
	const pingRes = await fetchTimeout('/api/ping', 3000, { signal: controller.signal })
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
