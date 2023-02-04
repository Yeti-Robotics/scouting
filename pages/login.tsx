import LoginForm from '@/components/Forms/LoginForm';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Anchor } from '@mantine/core';

const Login = () => {
	const router = useRouter();

	return (
		<Layout>
			<LoginForm />
			<Link href={`/register?from${String(router.query.from || '/')}`} passHref={true}>
				<Anchor m='md'>Don't have an account? Register Here!</Anchor>
			</Link>
		</Layout>
	);
};

export default Login;
