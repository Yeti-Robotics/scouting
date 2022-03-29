import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

export const scheduleBlockSchema = new Schema<ScheduleBlockI>(
	{
		startTime: { type: Number, required: true },
		endTime: { type: Number, required: true },
		blue1: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue2: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue3: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red1: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red2: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red3: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		min30: { type: Boolean, default: () => false },
		min10: { type: Boolean, default: () => false },
	},
	{ timestamps: true, collection: 'scheduleBlocks' },
);

export interface ScheduleBlockI {
	_id: string;
	startTime: number;
	endTime: number;
	blue1?: UserI;
	blue2?: UserI;
	blue3?: UserI;
	red1?: UserI;
	red2?: UserI;
	red3?: UserI;
	createdAt: string;
	updatedAt: string;
	min30: boolean;
	min10: boolean;
}

export interface CreateScheduleBlock {
	_id: string;
	startTime: number;
	endTime: number;
	blue1: string | null;
	blue2: string | null;
	blue3: string | null;
	red1: string | null;
	red2: string | null;
	red3: string | null;
	createdAt: string;
	updatedAt: string;
	min30: boolean;
	min10: boolean;
}

export const POPULATE_SCOUTERS = 'blue1 blue2 blue3 red1 red2 red3';

const ScheduleBlock =
	(models.scheduleBlock as Model<CreateScheduleBlock>) ||
	model('scheduleBlock', scheduleBlockSchema);

export default ScheduleBlock;
