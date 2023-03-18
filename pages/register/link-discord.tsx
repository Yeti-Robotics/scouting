import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const getCreds = (url: string) => {
	const params = url.split('#')[1];
	const obj: Record<string, string> = {};
	params.split('&').forEach((pair) => {
		const [key, val] = pair.split('=');
		obj[key] = val;
	});
	return obj;
};

const LinkDiscord = () => {
	const router = useRouter();
	useEffect(() => {
		const query = getCreds(router.asPath);
		console.log(query);
		if (!query.access_token) router.push('/register');
		fetch('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify({
				at: query.access_token,
				user: JSON.parse(decodeURIComponent(query.state.replace(/\+/g, ' '))),
			}),
		}).then((res) => {
			if (res.ok) return router.push('/');
			router.push('/register');
		});
	}, []);

	return <Loader size='xl' />;
};

export default LinkDiscord;
