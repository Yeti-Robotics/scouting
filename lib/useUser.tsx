import { LoginForm } from '@/components/Forms/LoginForm';
import { UserI } from '@/models/User';
import { openModal } from '@mantine/modals';
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
	modal: boolean;
}>;

export const useUser = ({
	redirectIfNotFound = true,
	redirectIfFound = false,
	redirectIfNotAdmin = false,
	redirectOnError = true,
	redirectTo = '/login',
	canRedirect = true,
	modal = true,
}: UseUserParams = {}) => {
	const router = useRouter();
	const {
		data: user,
		error,
		mutate,
		isLoading,
	} = useSWR<UserI>('/api/auth/decode', fetcher, { refreshInterval: 1000 });
	const redirectUrl = `${redirectTo}?from=${router.asPath || '/'}`;
	const handleFail = () => {
		if (modal)
			openModal({
				title: 'Log In',
				children: <LoginForm modal />,
			});
		else router.push(redirectUrl);
	};

	if (isLoading) {
		return { user, error, loading: true, mutate };
	}

	if (error) {
		if (canRedirect && redirectOnError && router.asPath !== redirectTo) handleFail();
		return { user: undefined, error, loading: false, mutate };
	}

	if (!user) {
		if (canRedirect && redirectIfNotFound && router.asPath !== redirectTo) handleFail();
		return { user, error, loading: false, mutate };
	}

	if (canRedirect && !user.administrator && redirectIfNotAdmin && router.asPath !== redirectTo)
		handleFail();
	if (canRedirect && redirectIfFound && router.asPath !== redirectTo) handleFail();

	return { user, error, loading: false, mutate };
};
