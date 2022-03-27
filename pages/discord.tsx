import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { UserI } from '@/models/User';
import { useRef } from 'react';
import useSWR from 'swr';

const Display: React.VFC<{ user: UserI; mutate: (...args: any) => any }> = ({ user, mutate }) => {
	const ref = useRef<HTMLInputElement>(null);
	return (
		<div style={{ margin: '1rem' }}>
			<h4>
				{user.firstName} {user.lastName} ({user.username})
			</h4>
			<input ref={ref} placeholder='disc id' />
			<button
				onClick={() => {
					if (!ref.current || !ref.current?.value || ref.current.value.length < 9) return;
					fetch(`/api/auth/users`, {
						method: 'PATCH',
						body: JSON.stringify({ ...user, discordId: ref.current.value }),
					}).then(() => mutate());
				}}
			>
				Update
			</button>
		</div>
	);
};

const Discord = () => {
	const { data, mutate } = useSWR<UserI[]>('/api/auth/users?normal=true', fetcher);

	if (!data) return <LoadingLayout />;

	return (
		<Layout>
			{data
				.filter((user) => !user.discordId)
				.map((user) => (
					<Display key={user._id} user={user} mutate={mutate} />
				))}
		</Layout>
	);
};

export default Discord;
