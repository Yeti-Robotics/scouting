import { CreateScheduleBlock } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { notifications } from '@mantine/notifications';
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
			blue1a: usersMap[data.blue1a ?? '']?._id,
			blue1b: usersMap[data.blue1b ?? '']?._id,
			blue2a: usersMap[data.blue2a ?? '']?._id,
			blue2b: usersMap[data.blue2b ?? '']?._id,
			blue3a: usersMap[data.blue3a ?? '']?._id,
			blue3b: usersMap[data.blue3b ?? '']?._id,
			red1a: usersMap[data.red1a ?? '']?._id,
			red1b: usersMap[data.red1b ?? '']?._id,
			red2a: usersMap[data.red2a ?? '']?._id,
			red2b: usersMap[data.red2b ?? '']?._id,
			red3a: usersMap[data.red3a ?? '']?._id,
			red3b: usersMap[data.red3b ?? '']?._id,
		};
		fetch('/api/schedule', {
			method: 'POST',
			body: JSON.stringify(data),
		}).then((res) => {
			notifications.show({ message: res.ok ? 'Created' : 'Failed' });
		});
	};

	const onUpdate: SubmitHandler<CreateScheduleBlock> = (data) => {
		if (!user || user.banned || !user.administrator) return;
		data = {
			...data,
			blue1a: usersMap[data.blue1a ?? '']?._id,
			blue1b: usersMap[data.blue1b ?? '']?._id,
			blue2a: usersMap[data.blue2a ?? '']?._id,
			blue2b: usersMap[data.blue2b ?? '']?._id,
			blue3a: usersMap[data.blue3a ?? '']?._id,
			blue3b: usersMap[data.blue3b ?? '']?._id,
			red1a: usersMap[data.red1a ?? '']?._id,
			red1b: usersMap[data.red1b ?? '']?._id,
			red2a: usersMap[data.red2a ?? '']?._id,
			red2b: usersMap[data.red2b ?? '']?._id,
			red3a: usersMap[data.red3a ?? '']?._id,
			red3b: usersMap[data.red3b ?? '']?._id,
		};
		fetch('/api/schedule', {
			method: 'PATCH',
			body: JSON.stringify(data),
		}).then((res) => {
			notifications.show({ message: res.ok ? 'Updated' : 'Failed' });
		});
	};

	return create ? onCreate : onUpdate;
};
