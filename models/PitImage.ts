import { Model, model, models, Schema, SchemaTypes } from 'mongoose';

const pitImageSchema = new Schema<PitImageI>(
	{
		formId: { type: SchemaTypes.ObjectId, required: true },
		teamNumber: { type: Number, required: true },
		data: { type: Buffer, required: true },
	},
	{ timestamps: true, collection: 'pitImages' },
);

export interface PitImageI {
	_id: string;
	formId: typeof SchemaTypes.ObjectId;
	teamNumber: number;
	data: Buffer;
}

export interface PitImageRes {
	_id: string;
	formId: string;
	teamNumber: number;
	data: {
		data: Uint8ClampedArray;
		type: string;
	};
}

const PitImage = (models?.pitImage as Model<PitImageI>) || model('pitImage', pitImageSchema);

export default PitImage;
