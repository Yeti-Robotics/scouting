import { model, models, Schema } from 'mongoose';

const teamSchema = new Schema<TeamI>({
	team_name: { type: String, required: true },
	team_number: { type: Number, required: true },
});

export interface TeamI {
	_id: string;
	team_number: number;
	team_name: string;
}

const Team = models.team || model('team', teamSchema);

export default Team;
