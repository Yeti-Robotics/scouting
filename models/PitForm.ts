import { Model, model, models, Schema } from 'mongoose';

const pitFormSchema = new Schema<PitFormI>(
	{
		teamNumber: { type: Number, required: true },
		scouter: { type: String, required: true }, // username
		endPosition: { type: Number, required: true }, // 0 - 6
		defense: { type: Number, required: true }, // 0 - 2
		shooting: { type: Number, required: true }, // 0 - 3
		drivetrain: { type: String, required: true },
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
	endPosition: number;
	defense: number;
	shooting: number;
	notes: string;
	createdAt: string;
}

const PitForm = (models.pitForm as Model<PitFormI>) || model('pitForm', pitFormSchema);

export default PitForm;
