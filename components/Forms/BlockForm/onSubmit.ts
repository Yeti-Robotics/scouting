import { CreateScheduleBlock } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';

type MatchFormOnSubmit = (
	create: boolean,
	user: UserI,
	users: Record<string, UserI>,
) => SubmitHandler<CreateScheduleBlock>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: MatchFormOnSubmit = (create, user, usersMap) => {
	const onCreate: SubmitHandler<CreateScheduleBlock> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		data = {
			...data,
			blue1: usersMap[data.blue1 ?? '']._id,
			blue2: usersMap[data.blue2 ?? '']._id,
			blue3: usersMap[data.blue3 ?? '']._id,
			red1: usersMap[data.red1 ?? '']._id,
			red2: usersMap[data.red2 ?? '']._id,
			red3: usersMap[data.red3 ?? '']._id,
			startTime: new Date(data.startTime).valueOf(),
			endTime: new Date(data.endTime).valueOf(),
		};
		fetch('/api/schedule', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	};

	const onUpdate: SubmitHandler<CreateScheduleBlock> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		data = {
			...data,
			blue1: usersMap[data.blue1 ?? '']._id,
			blue2: usersMap[data.blue2 ?? '']._id,
			blue3: usersMap[data.blue3 ?? '']._id,
			red1: usersMap[data.red1 ?? '']._id,
			red2: usersMap[data.red2 ?? '']._id,
			red3: usersMap[data.red3 ?? '']._id,
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
