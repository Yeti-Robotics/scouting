import { paginate } from '@/lib/api/paginate';
import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import StandForm, { CreateStandForm } from '@/models/StandForm';
import Team from '@/models/Team';

interface TBATeamSimple {
	city: string;
	country: string;
	key: string;
	name: string;
	nickname: string;
	state_prov: string;
	team_number: number;
}

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		const forms = await paginate(StandForm, req.query);
		console.log('popilatin');
		await StandForm.populate(forms, { path: 'scouter' });
		return res.status(200).json(forms);
	})
	.post(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized.' });
		const form: CreateStandForm = JSON.parse(req.body);

		const savedForm = new StandForm({ ...form, scouter: req.user._id });
		await savedForm.save();

		res.status(200).json({ message: 'Form saved!' });

		const team = await Team.findOne().where({ team_number: form.teamNumber });

		if (!team) {
			const headers = new Headers();
			headers.append('X-TBA-Auth-Key', String(process.env.TBA_SECRET));
			headers.append('accept', 'application/json');
			const apiRes = await fetch(
				`https://www.thebluealliance.com/api/v3/team/frc${form.teamNumber}`,
				{ headers },
			);
			if (!apiRes.ok) return;
			const teamData: TBATeamSimple = await apiRes.json();

			if (teamData.nickname) {
				const newTeam = new Team({
					team_name: teamData.nickname,
					team_number: form.teamNumber,
				});
				await newTeam.save();
			}
		}
	})
	.patch(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update forms.' });
		const form: CreateStandForm = JSON.parse(req.body);

		await StandForm.updateOne({ _id: form._id }, form);
		return res.status(200).json({ message: 'Form successfully updated.' });
	});
