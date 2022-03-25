import { Model } from 'mongoose';
import { NextApiRequest } from 'next';

export const paginate = async <T>(
	model: Model<T>,
	query: NextApiRequest['query'],
): Promise<T[]> => {
	const filter: Partial<T> = JSON.parse(String(query.filter));
	const sort = JSON.parse(String(query.sort));
	// if no sort just sort by most recent
	if (!Object.keys(sort)[0]) sort.createdAt = -1;
	const forms = await model.aggregate<T>([{ $match: filter }, { $sort: sort }]);
	return forms;
};
