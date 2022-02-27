import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';

type MatchFormOnSubmit = (create: boolean, user: UserI) => SubmitHandler<MatchI>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: MatchFormOnSubmit = (create, user) => {
	const onCreate: SubmitHandler<MatchI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		const { bets, winner, ...filtered } = data;
		fetch('/api/matches', {
			method: 'POST',
			body: JSON.stringify(filtered),
		});
	};

	const onUpdate: SubmitHandler<MatchI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		fetch('/api/matches/', {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	};

	return create ? onCreate : onUpdate;
};
