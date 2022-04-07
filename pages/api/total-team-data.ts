import { RouteHandler } from '@/lib/api/RouteHandler';
import { TeamData } from '@/models/aggregations/teamData';
import ashData from '@/past-data/ash-team-data.json';
import pemData from '@/past-data/pem-team-data.json';

const mergeData = (...sets: TeamData[][]): TeamData[] => {
	const result: TeamData[] = [];

	sets.forEach((dataSet) => result.concat(dataSet));

	const pushed: Record<number, boolean> = {};

	result.reverse().map((data) => {
		if (pushed[data.teamNumber]) return;
		pushed[data.teamNumber] = true;
		return data;
	});

	return result.filter((data) => data);
};

export default new RouteHandler().get(async (req, res) => {
	const ashData: TeamData[] = await (await fetch('/ash-team-data.json')).json();

	const data = mergeData(ashData, pemData as unknown as TeamData[]);

	return res.status(200).json(data);
});
