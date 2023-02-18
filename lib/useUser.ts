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
	canRedirect: boolean;
}>;

export const useUser = ({
	redirectIfNotFound = true,
	redirectIfFound = false,
	redirectIfNotAdmin = false,
	redirectOnError = true,
	redirectTo = '/login',
	canRedirect = true,
}: UseUserParams = {}) => {
	const router = useRouter();
	const { data: user, error, mutate, isLoading } = useSWR<UserI>('/api/auth/decode', fetcher);
	const redirectUrl = `${redirectTo}?from=${router.asPath || '/'}`;

	if (isLoading) {
		return { user, error, loading: true, mutate };
	}

	if (error) {
		if (canRedirect && redirectOnError && router.asPath !== redirectTo)
			router.push(redirectUrl);
		return { user: undefined, error, loading: false, mutate };
	}

	if (!user) {
		if (canRedirect && redirectIfNotFound && router.asPath !== redirectTo)
			router.push(redirectUrl);
		return { user, error, loading: false, mutate };
	}

	if (canRedirect && !user.administrator && redirectIfNotAdmin && router.asPath !== redirectTo)
		router.push(redirectUrl);
	if (canRedirect && redirectIfFound && router.asPath !== redirectTo) router.push(redirectUrl);

	return { user, error, loading: false, mutate };
};
