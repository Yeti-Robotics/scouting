import mongoose, { Model } from 'mongoose';
import { ScheduleBlockI, scheduleBlockSchema } from '../../models/ScheduleBlock';
import { UserI, userSchema } from '../../models/User';

let models: { ScheduleBlock: Model<ScheduleBlockI>; User: Model<UserI> } = {} as any;

export const model = () => {
	const User = mongoose.model('user', userSchema, 'users');
	const ScheduleBlock = mongoose.model('scheduleBlock', scheduleBlockSchema, 'scheduleBlocks');
	models = { ScheduleBlock, User };
	return models;
};

export const useModels = (): ReturnType<typeof model> =>
	Object.keys(models).length > 0 ? models : model();
