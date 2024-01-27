import { Model, model, models, Schema } from 'mongoose';
import { UserI } from './User';

const SPRSchema = new Schema<SPRI>({
	eventKey: { type: String, required: true },
	matchNumber: { type: Number, required: true },
	alliance: { type: String, required: true },
	scouter: { type: String, ref: 'user', required: true },
	matchSPR: { type: Number, required: true },
});

export interface SPRI {
	eventKey: string;
	matchNumber: number;
	alliance: string;
	scouter: UserI;
	matchSPR: number;
}

const SPR = (models?.SPR as Model<SPRI>) || model('SPR', SPRSchema);

export default SPR;
