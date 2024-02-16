import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

export const scheduleBlockSchema = new Schema<
	Omit<ScheduleBlockI, 'startTime' | 'endTime'> & { startTime: Date; endTime: Date }
>(
	{
		startMatch: { type: Number, required: true },
		lastMatch: { type: Number, required: true },
		blue1a: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue1b: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue2a: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue2b: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue3a: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		blue3b: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red1a: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red1b: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red2a: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red2b: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red3a: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		red3b: { type: Schema.Types.ObjectId, ref: 'user', required: false },
		threeAway: { type: Boolean, default: () => false },
		oneAway: { type: Boolean, default: () => false },
	},
	{ timestamps: true, collection: 'scheduleBlocks' },
);

export interface ScheduleBlockI {
	_id: string;
	startMatch: number;
	lastMatch: number;
	blue1a?: UserI;
	blue1b?: UserI;
	blue2a?: UserI;
	blue2b?: UserI;
	blue3a?: UserI;
	blue3b?: UserI;
	red1a?: UserI;
	red1b?: UserI;
	red2a?: UserI;
	red2b?: UserI;
	red3a?: UserI;
	red3b?: UserI;
	createdAt: string;
	updatedAt: string;
	threeAway: boolean;
	oneAway: boolean;
}

export interface CreateScheduleBlock {
	_id: string;
	startMatch: number;
	lastMatch: number;
	blue1a?: string;
	blue1b?: string;
	blue2a?: string;
	blue2b?: string;
	blue3a?: string;
	blue3b?: string;
	red1a?: string;
	red1b?: string;
	red2a?: string;
	red3b?: string;
	red2b?: string;
	red3a?: string;
	createdAt: string;
	updatedAt: string;
	threeAway: boolean;
	oneAway: boolean;
}

const ScheduleBlock =
	(models?.scheduleBlock as Model<
		Omit<ScheduleBlockI, 'startTime' | 'endTime'> & { startTime: Date; endTime: Date }
	>) || model('scheduleBlock', scheduleBlockSchema);

export default ScheduleBlock;
