import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

const standFormSchema = new Schema<StandFormI>(
	{
		teamNumber: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
		setNumber: { type: Number, default: () => 1 },
		scouter: { type: String, ref: 'user', required: true }, // user _id
		autoTopCubes: { type: Number, required: true },
		autoTopCones: { type: Number, required: true },
		autoMidCubes: { type: Number, required: true },
		autoMidCones: { type: Number, required: true },
		autoLowCubes: { type: Number, required: true },
		autoLowCones: { type: Number, required: true },
		autoDocked: { type: Boolean, default: () => false },
		autoEngaged: { type: Boolean, default: () => false },
		teleopTopCubes: { type: Number, required: true },
		teleopTopCones: { type: Number, required: true },
		teleopMidCubes: { type: Number, required: true },
		teleopMidCones: { type: Number, required: true },
		teleopLowCubes: { type: Number, required: true },
		teleopLowCones: { type: Number, required: true },
		teleopDocked: { type: Boolean, default: () => false },
		teleopEngaged: { type: Boolean, default: () => false },
		numberOnCharger: { type: Number, required: true },
		preload: { type: Boolean, required: true },
		initiationLine: { type: Boolean, required: true },
		defense: { type: Number, required: true },
		links: { type: Number, required: true },
		penalties: { type: Number, required: true },
		approved: { type: Boolean, default: () => false },
		notes: { type: String, required: true },
	},
	{ timestamps: true, collection: 'standForms' },
);

export interface CreateStandForm {
	_id: string;
	teamNumber: number;
	matchNumber: number;
	setNumber: number;
	scouter: string;
	autoTopCubes: number;
	autoTopCones: number;
	autoMidCubes: number;
	autoMidCones: number;
	autoLowCubes: number;
	autoLowCones: number;
	autoDocked: boolean;
	autoEngaged: boolean;
	teleopTopCubes: number;
	teleopTopCones: number;
	teleopMidCubes: number;
	teleopMidCones: number;
	teleopLowCubes: number;
	teleopLowCones: number;
	teleopDocked: boolean;
	teleopEngaged: boolean;
	numberOnCharger: number;
	preload: boolean;
	initiationLine: boolean;
	links: number;
	penalties: number;
	defense: number;
	approved: boolean;
	notes: string;
	createdAt: string;
	updatedAt: string;
}

// i stands for interface
export interface StandFormI {
	_id: string;
	teamNumber: number;
	matchNumber: number;
	setNumber: number;
	scouter?: UserI;
	autoTopCubes: number;
	autoTopCones: number;
	autoMidCubes: number;
	autoMidCones: number;
	autoLowCubes: number;
	autoLowCones: number;
	autoDocked: boolean;
	autoEngaged: boolean;
	teleopTopCubes: number;
	teleopTopCones: number;
	teleopMidCubes: number;
	teleopMidCones: number;
	teleopLowCubes: number;
	teleopLowCones: number;
	teleopDocked: boolean;
	teleopEngaged: boolean;
	numberOnCharger: number;
	preload: boolean;
	initiationLine: boolean;
	links: number;
	penalties: number;
	defense: number;
	approved: boolean;
	notes: string;
	createdAt: string;
	updatedAt: string;
}

const StandForm = (models?.standForm as Model<StandFormI>) || model('standForm', standFormSchema);

export default StandForm;
