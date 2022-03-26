import BlockForm from '@/components/Forms/BlockForm';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { ScheduleBlockI } from '@/models/ScheduleBlock';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const Block = () => {
	const router = useRouter();
	const id = String(router.query.id);
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { data } = useSWR<ScheduleBlockI>(router.isReady ? `/api/schedule/${id}` : null, fetcher);

	if (!data || !user) return <LoadingLayout />;

	return (
		<Layout>
			<BlockForm create={false} defaultBlock={data} id={id} canEdit={user.administrator} />
		</Layout>
	);
};

export default Block;
