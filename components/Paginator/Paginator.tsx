import fetcher from '@/lib/fetch';
import { Refresh } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { FilterWrapper, PaginatorWrapper, ResultsDisplay } from './Paginator.styles';

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
	Filter: React.VFC<FilterProps<T>>;
	Display: React.VFC<DisplayProps<T>>;
}

const ReloadButton: React.VFC<{ onClick: (...args: any[]) => any }> = ({ onClick }) => (
	<Button
		onClick={onClick}
		variant='contained'
		sx={{ position: 'absolute', top: '1rem', right: '3rem' }}
	>
		<Refresh sx={{ m: 1 }} />
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
	console.log({ obj, sanitized, recursed });
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
			<PaginatorWrapper>
				<ReloadButton onClick={reload} />
				<FilterWrapper>
					<Filter state={[query, setQuery]} />
				</FilterWrapper>
				<ResultsDisplay>
					<CircularProgress />
				</ResultsDisplay>
			</PaginatorWrapper>
		);
	}

	if (error) {
		return (
			<PaginatorWrapper>
				<ReloadButton onClick={reload} />
				<FilterWrapper>
					<Filter state={[query, setQuery]} />
				</FilterWrapper>
				<ResultsDisplay>
					<h1>There was an error getting your data.</h1>
				</ResultsDisplay>
			</PaginatorWrapper>
		);
	}

	if (!data[0]) {
		return (
			<PaginatorWrapper>
				<ReloadButton onClick={reload} />
				<FilterWrapper>
					<Filter state={[query, setQuery]} />
				</FilterWrapper>
				<ResultsDisplay>
					<h1>Nothing matched your query.</h1>
				</ResultsDisplay>
			</PaginatorWrapper>
		);
	}

	return (
		<PaginatorWrapper>
			<ReloadButton onClick={reload} />
			<FilterWrapper>
				<Filter state={[query, setQuery]} />
			</FilterWrapper>
			<ResultsDisplay>
				{data.map((record) => {
					return <Display key={record._id} record={record} />;
				})}
			</ResultsDisplay>
		</PaginatorWrapper>
	);
};

export default Paginator;
