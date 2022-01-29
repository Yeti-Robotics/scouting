import { UserI } from '@/models/User';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from './fetch';

type UseUserParams = Partial<{
	redirectIfNotFound: boolean;
	redirectIfFound: boolean;
	redirectIfNotAdmin: boolean;
	redirectOnError: boolean;
	redirectTo: string;
	primary: boolean; // this instance can redirect
}>;

export const useUser = ({
	redirectIfNotFound = true,
	redirectIfFound = false,
	redirectIfNotAdmin = false,
	redirectOnError = true,
	redirectTo = '/login',
	primary = true,
}: UseUserParams = {}) => {
	const router = useRouter();
	const { data: user, error, isValidating, mutate } = useSWR<UserI>('/api/auth/decode', fetcher);
	const redirectUrl = `${redirectTo}?from=${router.pathname || '/'}`;

	if (!user && isValidating) {
		return { user, error, loading: true, mutate };
	}

	if (!user) {
		if (primary && redirectIfNotFound && router.pathname !== redirectTo)
			router.push(redirectUrl);
		return { user, error, loading: false, mutate };
	}

	if (error) {
		if (primary && redirectOnError && router.pathname !== redirectTo) router.push(redirectUrl);
		return { user: undefined, error, loading: false, mutate };
	}

	if (primary && !user.administrator && redirectIfNotAdmin && router.pathname !== redirectTo)
		router.push(redirectUrl);
	if (primary && redirectIfFound && router.pathname !== redirectTo) router.push(redirectUrl);

	return { user, error, loading: false, mutate };
};
