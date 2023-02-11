import { LoginForm } from '@/components/Forms/LoginForm';
import { Link } from '@/components/Link';
import { useRouter } from 'next/router';

const Login = () => {
	const router = useRouter();

	return (
		<>
			<LoginForm />
			<Link href={`/register?from${String(router.query.from || '/')}`}>
				Don't have an account? Register Here!
			</Link>
		</>
	);
};

export default Login;
