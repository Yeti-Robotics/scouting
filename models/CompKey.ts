import { Schema, model, models, Model } from 'mongoose';

const compKeySchema = new Schema<CompKeyI>(
	{
		compKey: { type: String, required: true, index: true },
		compYear: { type: Number, required: true, index: true },
	},
	{ timestamps: true, collection: 'compKey' },
);

export interface CompKeyI {
	compKey: string;
	compYear: number;
	createdAt: string;
	updatedAt: string;
}

const CompKey = (models?.compKey as Model<CompKeyI>) || model('compKey', compKeySchema);

export default CompKey;
