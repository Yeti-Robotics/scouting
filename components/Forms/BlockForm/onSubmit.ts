import { CreateScheduleBlock, ScheduleBlockI } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';

type MatchFormOnSubmit = (create: boolean, user: UserI) => SubmitHandler<ScheduleBlockI>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: MatchFormOnSubmit = (create, user) => {
	const onCreate: SubmitHandler<ScheduleBlockI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		(data as unknown as CreateScheduleBlock) = {
			...data,
			blue1: data.blue1?._id || null,
			blue2: data.blue2?._id || null,
			blue3: data.blue3?._id || null,
			red1: data.red1?._id || null,
			red2: data.red2?._id || null,
			red3: data.red3?._id || null,
			startTime: new Date(data.startTime).valueOf(),
			endTime: new Date(data.endTime).valueOf(),
		};
		fetch('/api/schedule', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	};

	const onUpdate: SubmitHandler<ScheduleBlockI> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		console.log(data);
		(data as unknown as CreateScheduleBlock) = {
			...data,
			blue1: data.blue1?._id || null,
			blue2: data.blue2?._id || null,
			blue3: data.blue3?._id || null,
			red1: data.red1?._id || null,
			red2: data.red2?._id || null,
			red3: data.red3?._id || null,
			startTime: new Date(data.startTime).valueOf(),
			endTime: new Date(data.endTime).valueOf(),
		};
		fetch('/api/schedule', {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	};

	return create ? onCreate : onUpdate;
};
