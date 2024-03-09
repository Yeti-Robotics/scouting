import { UserI } from '@/models/User';
import { NextRouter } from 'next/router';
import { SubmitHandler } from 'react-hook-form';
import { FormMatch } from './MatchForm';

type MatchFormOnSubmit = (
	create: boolean,
	user: UserI,
	router: NextRouter,
) => SubmitHandler<FormMatch>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: MatchFormOnSubmit = (create, user, router) => {
	const onCreate: SubmitHandler<FormMatch> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		const { winner, ...filtered } = data;
		(filtered as any).startTime = new Date(data.startTime).valueOf();
		fetch('/api/matches', {
			method: 'POST',
			body: JSON.stringify(filtered),
		}).then((res) => {
			if (res.ok) router.push('/casino/matches');
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
