import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';

type MatchFormOnSubmit = (create: boolean, user: UserI) => SubmitHandler<MatchI>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: MatchFormOnSubmit = (create, user) => {
	const onCreate: SubmitHandler<MatchI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		const { bets, winner, scouters, ...filtered } = data;
		(filtered as MatchI).scouters = {
			blue1: (scouters as any)?.blue1?.username || (scouters as any)?.blue1,
			blue2: (scouters as any)?.blue2?.username || (scouters as any)?.blue2,
			blue3: (scouters as any)?.blue3?.username || (scouters as any)?.blue3,
			red1: (scouters as any)?.red1?.username || (scouters as any)?.red1,
			red2: (scouters as any)?.red2?.username || (scouters as any)?.red2,
			red3: (scouters as any)?.red3?.username || (scouters as any)?.red3,
		};
		filtered.startTime = new Date(data.startTime).valueOf();
		fetch('/api/matches', {
			method: 'POST',
			body: JSON.stringify(filtered),
		});
	};

	const onUpdate: SubmitHandler<MatchI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		(data as MatchI).scouters = {
			blue1: (data.scouters as any)?.blue1?.username || (data.scouters as any)?.blue1,
			blue2: (data.scouters as any)?.blue2?.username || (data.scouters as any)?.blue2,
			blue3: (data.scouters as any)?.blue3?.username || (data.scouters as any)?.blue3,
			red1: (data.scouters as any)?.red1?.username || (data.scouters as any)?.red1,
			red2: (data.scouters as any)?.red2?.username || (data.scouters as any)?.red2,
			red3: (data.scouters as any)?.red3?.username || (data.scouters as any)?.red3,
		};
		data.startTime = new Date(data.startTime).valueOf();
		(data.winner as any) = data.winner ? data.winner : undefined;
		fetch('/api/matches/', {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	};

	return create ? onCreate : onUpdate;
};
