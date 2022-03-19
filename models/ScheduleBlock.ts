import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

const scheduleBlockSchema = new Schema<ScheduleBlockI>(
	{
		startTime: { type: Number, required: true },
		endTime: { type: Number, required: true },
		blue1: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		blue2: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		blue3: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		red1: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		red2: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		red3: { type: Schema.Types.ObjectId, ref: 'user', required: true },
	},
	{ timestamps: true, collection: 'scheduleBlocks' },
);

scheduleBlockSchema.pre('find', function (next) {
	this.populate({ path: 'blue1 blue2 blue3 red1 red2 red3' });
	next();
});

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

const User =
	(models.scheduleBlock as Model<ScheduleBlockI>) || model('scheduleBlock', scheduleBlockSchema);

export default User;
