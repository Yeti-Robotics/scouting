import { model, models, Schema, SchemaTypes } from 'mongoose';

const pitImageSchema = new Schema<PitImageI>(
	{
		formId: { type: SchemaTypes.ObjectId, required: true },
		data: { type: Buffer, required: true },
	},
	{ timestamps: true, collection: 'pitImages' },
);

export interface PitImageI {
	_id: string;
	formId: typeof SchemaTypes.ObjectId;
	data: Buffer;
}

const PitImage = models.pitImage || model('piImage', pitImageSchema);

export default PitImage;
