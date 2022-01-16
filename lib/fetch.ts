export default async function fetcher<JSON = any>(
	url: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const res = await fetch(url, init);

	if (!res.ok) {
		const err = new Error(`${res.status}: ${res.statusText}`);
		throw err;
	}

	return res.json();
}
