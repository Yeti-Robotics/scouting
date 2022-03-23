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
			blue1: data.blue1?._id,
			blue2: data.blue2?._id,
			blue3: data.blue3?._id,
			red1: data.red1?._id,
			red2: data.red2?._id,
			red3: data.red3?._id,
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
		(data as unknown as CreateScheduleBlock) = {
			...data,
			blue1: data.blue1?._id,
			blue2: data.blue2?._id,
			blue3: data.blue3?._id,
			red1: data.red1?._id,
			red2: data.red2?._id,
			red3: data.red3?._id,
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
