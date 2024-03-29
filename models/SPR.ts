import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

const SPRSchema = new Schema<SPRI>({
	matchNumber: { type: Number, required: true },
	alliance: { type: String, required: true },
	scouter: { type: String, ref: 'user', required: true },
	matchSPR: { type: Number, required: true },
});

export interface SPRI {
	matchNumber: number;
	alliance: string;
	scouter: string;
	matchSPR: number;
}

const SPR = (models?.SPR as Model<SPRI>) || model('SPR', SPRSchema);

export default SPR;
