import { Model, model, models, Schema } from 'mongoose';

const scoreSpots = ['Amp', 'Speaker'] as const;

export const whereScoreEnum = scoreSpots.map((scoreSpot) => `${scoreSpot}`);

const pitFormSchema = new Schema<PitFormI>(
	{
		teamNumber: { type: Number, required: true },
		scouter: { type: String, required: true }, // username
		drivetrain: { type: String, required: true },
		weight: { type: Number, required: true },
		width: { type: Number, required: true },
		length: { type: Number, required: true },
		whereScore: { type: [String], enum: whereScoreEnum, required: true },
		priorityScore: { type: String, enum: [...whereScoreEnum, 'None'], required: true },
		climb: { type: Boolean, required: true },
		trapScore: { type: Boolean, required: true },
		notes: { type: String, required: true },
	},
	{ timestamps: true, collection: 'pitForms' },
);

// i stands for interface
export interface PitFormI {
	_id: string;
	teamNumber: number;
	scouter: string; // username
	drivetrain: string;
	weight: number;
	width: number;
	length: number;
	whereScore: string[];
	priorityScore: string;
	climb: boolean;
	trapScore: boolean;
	notes: string;
	createdAt: string;
}

const PitForm = (models?.pitForm as Model<PitFormI>) || model('pitForm', pitFormSchema);

export default PitForm;
