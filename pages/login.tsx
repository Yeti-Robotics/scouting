import LoginForm from '@/components/Forms/LoginForm';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/router';

const Login = () => {
	const router = useRouter();

	return (
		<Layout>
			<LoginForm />
			<Link href={`/register?from${String(router.query.from || '/')}`} passHref={true}>
				<MuiLink sx={{ m: 2 }}>Don't have an account? Register Here!</MuiLink>
			</Link>
		</Layout>
	);
};

export default Login;
