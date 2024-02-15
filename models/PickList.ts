import { Schema, model, models, Model } from 'mongoose';

const pickListSchema = new Schema<PickListI>(
	{
		name: { type: String, required: true, index: true },
		ordering: { type: [Number], required: true },
	},
	{ timestamps: true, collection: 'pickList' },
);

export interface NewPicklistI {
	name: string;
	ordering: number[];
}

export interface PickListI extends NewPicklistI {
	_id: string;
	createdAt: string;
	updatedAt: string;
}

const PickList = (models?.pickList as Model<PickListI>) || model('pickList', pickListSchema);

export default PickList;
