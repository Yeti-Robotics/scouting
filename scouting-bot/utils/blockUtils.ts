import { ScheduleBlockI } from '../../models/ScheduleBlock';
import { UserI } from '../../models/User';

export const userScouting = (user: UserI, block: ScheduleBlockI) => {
	if (String(user._id) === String(block.blue1?._id)) return 'Blue 1';
	else if (String(user._id) === String(block.blue2?._id)) return 'Blue 2';
	else if (String(user._id) === String(block.blue3?._id)) return 'Blue 3';
	else if (String(user._id) === String(block.red1?._id)) return 'Red 1';
	else if (String(user._id) === String(block.red2?._id)) return 'Red 2';
	else if (String(user._id) === String(block.red3?._id)) return 'Red 3';
	else return '';
};
