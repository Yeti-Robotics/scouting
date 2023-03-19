import { Model, model, models, Schema } from 'mongoose';

export const pieceSourceEnum = ['Chute', 'Double Station', 'Ground', 'None'] as const;

const pieces = ['Cubes', 'Cones'] as const;
const scoreSpots = ['Bottom', 'Middle', 'Top'] as const;

export const whereScoreEnum = pieces.flatMap((piece) =>
	scoreSpots.map((scoreSopt) => `${piece} ${scoreSopt}`),
);

const pitFormSchema = new Schema<PitFormI>(
	{
		teamNumber: { type: Number, required: true },
		scouter: { type: String, required: true }, // username
		defense: { type: Number, required: true }, // 0 - 2
		drivetrain: { type: String, required: true },
		weight: { type: Number, required: true },
		width: { type: Number, required: true },
		length: { type: Number, required: true },
		//pieceSource: { type: String, enum: pieceSourceEnum, required: true },
		//whereScore: { type: [String], enum: whereScoreEnum, required: true },
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
	defense: number;
	weight: number;
	width: number;
	length: number;
	pieceSource: 'Chute' | 'Double Station' | 'Ground' | 'None';
	whereScore: string[];
	notes: string;
	createdAt: string;
}

const PitForm = (models?.pitForm as Model<PitFormI>) || model('pitForm', pitFormSchema);

export default PitForm;
