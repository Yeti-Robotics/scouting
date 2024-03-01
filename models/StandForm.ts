import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

const standFormSchema = new Schema<StandFormI>(
	{
		teamNumber: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
		setNumber: { type: Number, default: () => 1 },
		scouter: { type: String, ref: 'user', required: true }, // user _id
		autoAmpNotes: { type: Number, required: true },
		autoSpeakerNotes: { type: Number, required: true },
		autoNotesMissed: { type: Number, required: true },
		teleopAmpNotes: { type: Number, required: true },
		teleopSpeakerNotes: { type: Number, required: true },
		teleopAmplifiedSpeakerNotes: { type: Number, required: true },
		teleopNotesMissed: { type: Number, required: true },
		shuttleNotes: { type: Number, required: true },
		trapAttempts: { type: Number, required: true },
		trapNotes: { type: Number, required: true },
		preload: { type: Boolean, required: true },
		initiationLine: { type: Boolean, required: true },
		climb: { type: Boolean, required: true },
		spotlight: { type: Boolean, required: true },
		park: { type: Boolean, required: true },
		numberOnChain: { type: Number, required: true },
		defense: { type: Number, required: true },
		penalties: { type: Number, required: true },
		approved: { type: Boolean, default: () => false },
		notes: { type: String, required: true },
		scoutScore: { type: Number, required: true },
		alliance: { type: String, required: true },
	},
	{ timestamps: true, collection: 'standForms' },
);

export interface CreateStandForm {
	_id: string;
	teamNumber: number;
	matchNumber: number;
	setNumber: number;
	scouter: string;
	autoAmpNotes: number;
	autoSpeakerNotes: number;
	autoNotesMissed: number;
	teleopAmpNotes: number;
	teleopSpeakerNotes: number;
	teleopAmplifiedSpeakerNotes: number;
	teleopNotesMissed: number;
	shuttleNotes: number;
	trapAttempts: number;
	trapNotes: number;
	preload: boolean;
	initiationLine: boolean;
	climb: boolean;
	spotlight: boolean;
	numberOnChain: number;
	park: boolean;
	penalties: number;
	defense: number;
	approved: boolean;
	notes: string;
	createdAt: string;
	updatedAt: string;
	scoutScore: number;
	alliance: string;
}

// i stands for interface
export interface StandFormI {
	_id: string;
	teamNumber: number;
	matchNumber: number;
	setNumber: number;
	scouter?: UserI;
	autoAmpNotes: number;
	autoSpeakerNotes: number;
	autoNotesMissed: number;
	teleopAmpNotes: number;
	teleopSpeakerNotes: number;
	teleopAmplifiedSpeakerNotes: number;
	teleopNotesMissed: number;
	shuttleNotes: number;
	trapAttempts: number;
	trapNotes: number;
	preload: boolean;
	initiationLine: boolean;
	climb: boolean;
	spotlight: boolean;
	numberOnChain: number;
	park: boolean;
	penalties: number;
	defense: number;
	approved: boolean;
	notes: string;
	createdAt: string;
	updatedAt: string;
	scoutScore: number;
	alliance: string;
}

const StandForm = (models?.standForm as Model<StandFormI>) || model('standForm', standFormSchema);

export default StandForm;
