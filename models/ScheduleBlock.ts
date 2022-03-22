import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

const scheduleBlockSchema = new Schema<ScheduleBlockI>(
	{
		startTime: { type: Number, required: true },
		endTime: { type: Number, required: true },
		blue1: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue2: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue3: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red1: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red2: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red3: { type: Schema.Types.ObjectId, ref: 'user', required: false },
	},
	{ timestamps: true, collection: 'scheduleBlocks' },
);

export interface ScheduleBlockI {
	_id: string;
	startTime: number;
	endTime: number;
	blue1: UserI;
	blue2: UserI;
	blue3: UserI;
	red1: UserI;
	red2: UserI;
	red3: UserI;
	createdAt: string;
	updatedAt: string;
}

export interface CreateScheduleBlock {
	_id: string;
	startTime: number;
	endTime: number;
	blue1: string;
	blue2: string;
	blue3: string;
	red1: string;
	red2: string;
	red3: string;
	createdAt: string;
	updatedAt: string;
}

const User =
	(models.scheduleBlock as Model<CreateScheduleBlock>) ||
	model('scheduleBlock', scheduleBlockSchema);

export default User;
