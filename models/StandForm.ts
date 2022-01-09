import { model, models, Schema } from 'mongoose';

const standFormSchema = new Schema<StandForm>(
	{
		teamNumber: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
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
		notes: { type: String, required: true },
	},
	{ timestamps: true, collection: 'standForms' },
);

export interface StandForm {
	teamNumber: number;
	matchNumber: number;
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
	notes: string;
}

const StandForm = models.standForm || model('standForm', standFormSchema);

export default StandForm;
