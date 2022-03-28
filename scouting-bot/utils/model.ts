import mongoose from 'mongoose';
import { scheduleBlockSchema } from '../../models/ScheduleBlock';
import { userSchema } from '../../models/User';

let models: any = {};

export const model = () => {
	const User = mongoose.model('user', userSchema, 'users');
	const ScheduleBlock = mongoose.model('scheduleBlock', scheduleBlockSchema, 'scheduleBlocks');
	models = { ScheduleBlock, User };
	return { ScheduleBlock, User };
};

export const useModels = (): ReturnType<typeof model> =>
	Object.keys(models).length > 0 ? models : model();
