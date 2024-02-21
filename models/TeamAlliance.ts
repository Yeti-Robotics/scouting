import { model, models, Schema } from 'mongoose';

const teamAllianceSchema = new Schema<TeamAllianceI>({
	compKey: { type: String, required: true, ref: 'compKey' },
	team_number: { type: Number, required: true, ref: 'team' },
});

export interface TeamAllianceI {
	compKey: string;
	team_number: number;
}

const TeamAlliance = models?.teamAlliance || model('teamAlliance', teamAllianceSchema);

export default TeamAlliance;
