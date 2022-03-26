export const validateIsNumber = (v: string) => {
	if (v === '') return true;
	const num = parseInt(v);
	if (isNaN(num)) return false;
	return true;
};

const numberKeys = ['teamNumber', 'matchNumber'];

export const sanitizeFilter = (data: any) => {
	const newObj: any = {};
	Object.keys(data).forEach((key) => {
		if (data[key] === '' || data[key] === undefined) return;
		if (numberKeys.includes(key)) {
			const num = parseInt(data[key]);
			if (isNaN(num)) return;
			newObj[key] = num;
			return;
		}
		newObj[key] = data[key];
	});
	return newObj;
};
