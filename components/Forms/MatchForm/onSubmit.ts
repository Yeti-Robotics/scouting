import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';
import { FormMatch } from './MatchForm';

type MatchFormOnSubmit = (create: boolean, user: UserI) => SubmitHandler<FormMatch>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: MatchFormOnSubmit = (create, user) => {
	const onCreate: SubmitHandler<FormMatch> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		const { bets, winner, ...filtered } = data;
		(filtered as any).startTime = new Date(data.startTime).valueOf();
		fetch('/api/matches', {
			method: 'POST',
			body: JSON.stringify(filtered),
		});
	};

	const onUpdate: SubmitHandler<FormMatch> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		(data as any).startTime = new Date(data.startTime).valueOf();
		(data.winner as any) = data.winner ? data.winner : undefined;
		fetch('/api/matches', {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	};

	return create ? onCreate : onUpdate;
};
