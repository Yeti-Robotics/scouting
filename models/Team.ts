import { model, models, Schema } from 'mongoose';

const teamSchema = new Schema<TeamI>({
	teamName: { type: String, required: true },
	teamNumber: { type: Number, required: true },
});

export interface TeamI {
	teamNumber: number;
	teamName: string;
}

const Team = models.team || model('team', teamSchema);

export default Team;
