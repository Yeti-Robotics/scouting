import { Model, model, models, Schema } from 'mongoose';

const userSchema = new Schema<UserI>(
	{
		username: { type: String, unique: true, required: true, minlength: 3, index: true },
		administrator: { type: Boolean, required: true, default: false },
		password: { type: String, required: true, minlength: 6 },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		teamNumber: { type: Number, required: true, min: 1 },
		banned: { type: Boolean, default: () => false },
		bannedBy: { type: String },
		coins: { type: Number, default: () => 100 },
		canScout: { type: Boolean, default: () => false },
		discordId: { type: String, required: true },
	},
	{ timestamps: true },
);

export interface UserI {
	_id: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	teamNumber: number;
	administrator: boolean;
	createdAt: string;
	updatedAt: string;
	banned: boolean;
	bannedBy?: string;
	coins: number;
	canScout: boolean;
	discordId: string;
}

const User = (models.user as Model<UserI>) || model('user', userSchema);

export default User;
