import { BlockForm } from '@/components/Forms/BlockForm';
import { useUser } from '@/lib/useUser';
import { Loader } from '@mantine/core';

const CreateBlock = () => {
	const { user } = useUser({ redirectIfNotAdmin: true });
	if (!user) return <Loader size='xl' />;
	return <BlockForm create canEdit />;
};

export default CreateBlock;
