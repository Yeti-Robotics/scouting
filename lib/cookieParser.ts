export const cookieParser = (cookies: string | undefined) => {
	const result: { [key: string]: string } = {};
	if (!cookies) return result;
	cookies.split(';').forEach((cookie) => {
		const separator = cookie.indexOf('=');
		const key = cookie.substring(0, separator).trim();
		const rawValue = cookie.substring(separator + 1);
		result[key] = rawValue;
	});
	return result;
};
