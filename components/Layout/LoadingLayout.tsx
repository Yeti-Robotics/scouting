import { CircularProgress } from '@mui/material';
import Layout from './Layout';

const LoadingLayout = () => {
	return (
		<Layout>
			<CircularProgress />
		</Layout>
	);
};

export default LoadingLayout;
