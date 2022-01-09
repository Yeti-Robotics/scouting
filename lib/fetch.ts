export default async function fetcher<JSON = any>(url: RequestInfo, init?: RequestInit) {
	const res = await fetch(url, init);
	return res.json();
}
