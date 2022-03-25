import { Model, model, models, Schema } from 'mongoose';

const standFormSchema = new Schema<StandFormI>(
	{
		teamNumber: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
		setNumber: { type: Number, default: () => 1 },
		scouter: { type: String, required: true }, // username
		autoUpperBallsScored: { type: Number, required: true },
		autoUpperBallsMissed: { type: Number, required: true },
		autoLowBallsScored: { type: Number, required: true },
		autoLowBallsMissed: { type: Number, required: true },
		teleopUpperBallsScored: { type: Number, required: true },
		teleopUpperBallsMissed: { type: Number, required: true },
		teleopLowBallsScored: { type: Number, required: true },
		teleopLowBallsMissed: { type: Number, required: true },
		preload: { type: Boolean, required: true },
		initiationLine: { type: Boolean, required: true },
		endPosition: { type: Number, required: true },
		defense: { type: Number, required: true },
		approved: { type: Boolean, default: () => false },
		notes: { type: String, required: true },
	},
	{ timestamps: true, collection: 'standForms' },
);

// i stands for interface
export interface StandFormI {
	_id: string;
	teamNumber: number;
	matchNumber: number;
	setNumber: number;
	scouter: string; // username
	autoUpperBallsScored: number;
	autoUpperBallsMissed: number;
	autoLowBallsScored: number;
	autoLowBallsMissed: number;
	teleopUpperBallsScored: number;
	teleopUpperBallsMissed: number;
	teleopLowBallsScored: number;
	teleopLowBallsMissed: number;
	preload: boolean;
	initiationLine: boolean;
	endPosition: number;
	defense: number;
	approved: boolean;
	notes: string;
	createdAt: string;
	updatedAt: string;
}

const StandForm = (models.standForm as Model<StandFormI>) || model('standForm', standFormSchema);

export default StandForm;
