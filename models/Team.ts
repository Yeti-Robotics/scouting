import { model, models, Schema } from 'mongoose';

const teamSchema = new Schema<Team>({
	teamName: { type: String, required: true },
	teamNumber: { type: Number, required: true },
});

export interface Team {
	teamNumber: number;
	teamName: string;
}

const Team = models.team || model('team', teamSchema);

export default Team;
