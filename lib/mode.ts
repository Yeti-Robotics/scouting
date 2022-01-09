export const modeArray = (array: any[]) => {
	if (array.length == 0) return [];
	const modeMap: any = {};
	let maxCount = 1,
		modes = [];

	for (let i = 0; i < array.length; i++) {
		const el = array[i];

		if (modeMap[el] == null) modeMap[el] = 1;
		else modeMap[el]++;

		if (modeMap[el] > maxCount) {
			modes = [el];
			maxCount = modeMap[el];
		} else if (modeMap[el] == maxCount) {
			modes.push(el);
			maxCount = modeMap[el];
		}
	}
	return modes;
};

export const mostCommonEndPos = (arr: number[]) => Math.min(...modeArray(arr));

export const mostCommonEndPosString = (arr: number[]) => {
	const val = mostCommonEndPos(arr);
	return val === 0
		? 'Nothing'
		: val === 1
		? 'Defense'
		: val === 2
		? 'Scoring'
		: val === 3
		? 'Low'
		: val === 4
		? 'Mid'
		: val === 5
		? 'High'
		: val === 6
		? 'Traverse'
		: 'no data';
};

export const endPosToString = (val: number) =>
	val === 0
		? 'Nothing'
		: val === 1
		? 'Defense'
		: val === 2
		? 'Scoring'
		: val === 3
		? 'Low'
		: val === 4
		? 'Mid'
		: val === 5
		? 'High'
		: val === 6
		? 'Traverse'
		: 'no data';
