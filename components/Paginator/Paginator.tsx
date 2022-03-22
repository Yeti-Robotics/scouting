import fetcher from '@/lib/fetch';
import { CircularProgress } from '@mui/material';
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

const Paginator = <T extends { _id: string; createdAt: string }>({
	object,
	route,
	Filter,
	Display,
}: Props<T>) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState({ page: 1, perPage: 20 });
	const [query, setQuery] = useState<Query<T>>({ filter: {}, sort: { createdAt: -1 } });
	const querystring = `?page=${page.page}&perPage=${page.perPage}&filter=${JSON.stringify(
		query.filter,
	)}&sort=${JSON.stringify(query.sort)}`;
	const { data, error } = useSWR<T[]>(`${route}${querystring}`, fetcher, {
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

	if (!data || loading) {
		return (
			<PaginatorWrapper>
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
