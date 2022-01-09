import { Model, model, models, Schema } from 'mongoose';

const userSchema = new Schema<UserI>(
	{
		username: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		teamNumber: { type: Number, required: true },
	},
	{ timestamps: true },
);

export interface UserI {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	teamNumber: number;
}

const User = (models.user as Model<UserI>) || model('user', userSchema);

export default User;
