import fetcher from '@/lib/fetch';
import { IconRefresh } from '@tabler/icons-react';
import { Box, Button, Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface Query<T> {
	filter: Partial<T>;
	sort: { [K in keyof T]?: 1 | -1 };
}

export interface FilterProps<T> {
	state: [Query<T>, React.Dispatch<React.SetStateAction<Query<T>>>];
}

export interface DisplayProps<T> {
	record: T;
}

interface Props<T> {
	object: T /* gives autocomplete on props */;
	route: string;
	Filter: React.FC<FilterProps<T>>;
	Display: React.FC<DisplayProps<T>>;
}

const ReloadButton = ({ onClick }: { onClick: (...args: any[]) => any }) => (
	<Button
		onClick={onClick}
		variant='contained'
		sx={{ position: 'fixed', top: '1rem', right: '3rem' }}
	>
		<IconRefresh />
	</Button>
);

const sanitizeFilters = (obj: Record<string, any>, recursed = false) => {
	const sanitized: Record<string, any> = {};
	Object.keys(obj).forEach((key) => {
		const val = obj[key];
		if (typeof val === 'object') return (sanitized[key] = sanitizeFilters(val, true));
		if (val === '') return;
		if (val === 'null') return (sanitized[key] = null);
		sanitized[key] = val;
	});
	return recursed && Object.keys(sanitized).length <= 0 ? undefined : sanitized;
};

const Paginator = <T extends { _id: string; createdAt: string }>({
	route,
	Filter,
	Display,
}: Props<T>) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState({ page: 1, perPage: 20 });
	const [query, setQuery] = useState<Query<T>>({ filter: {}, sort: { createdAt: -1 } });
	const querystring = `?page=${page.page}&perPage=${page.perPage}&filter=${JSON.stringify(
		sanitizeFilters(query.filter),
	)}&sort=${JSON.stringify(query.sort)}`;
	const { data, error, mutate } = useSWR<T[]>(`${route}${querystring}`, fetcher, {
		onSuccess: () => setLoading(false),
	});
	// update queries when page loads
	useEffect(() => {
		setPage({
			page: parseInt(String(router.query.page)) || 1,
			perPage: parseInt(String(router.query.perPage)) || 20,
		});
		setQuery({
			filter: JSON.parse(String(router.query.filter || '{}')),
			sort: JSON.parse(String(router.query.sort || '{}')),
		});
	}, []);

	// update querystring when queries change
	useEffect(() => {
		setLoading(true);
		//router.push(`${router.pathname}${querystring}`, undefined, { shallow: true });
	}, [page, query]);

	const reload = () => {
		setLoading(true);
		mutate();
	};

	if (!data || loading) {
		return (
			<Box>
				<ReloadButton onClick={reload} />
				<Box>
					<Filter state={[query, setQuery]} />
				</Box>
				<Box>
					<Loader size='xl' />
				</Box>
			</Box>
		);
	}

	if (error) {
		return (
			<Box>
				<ReloadButton onClick={reload} />
				<Box>
					<Filter state={[query, setQuery]} />
				</Box>
				<Box>
					<h1>There was an error getting your data.</h1>
				</Box>
			</Box>
		);
	}

	if (!data[0]) {
		return (
			<Box>
				<ReloadButton onClick={reload} />
				<Box>
					<Filter state={[query, setQuery]} />
				</Box>
				<Box>
					<h1>Nothing matched your query.</h1>
				</Box>
			</Box>
		);
	}

	return (
		<Box>
			<ReloadButton onClick={reload} />
			<Box>
				<Filter state={[query, setQuery]} />
			</Box>
			<Box>
				{data.map((record) => {
					return <Display key={record._id} record={record} />;
				})}
			</Box>
		</Box>
	);
};

export default Paginator;
