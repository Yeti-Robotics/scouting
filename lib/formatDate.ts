export const numToDateTimeInput = (time: number) =>
	`${new Date(time).toLocaleString(undefined, { year: 'numeric' })}-${new Date(
		time,
	).toLocaleString(undefined, { month: '2-digit' })}-${new Date(time).toLocaleString(undefined, {
		day: '2-digit',
	})}T${new Date(time).toLocaleString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})}`;
