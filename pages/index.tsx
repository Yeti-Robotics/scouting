import Layout from '@/components/Layout';
import TeamDataTable from '@/components/TeamDataTable';
import fetcher from '@/lib/fetch';
import { TeamData } from '@/models/aggregations/teamData';
import { DataGrid } from '@mui/x-data-grid';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
	const { data, error } = useSWR<TeamData[]>('/api/team-data', fetcher);

	if (!data) {
		return (
			<Layout>
				<h1>loading...</h1>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<h1>There was an error getting your data.</h1>
			</Layout>
		);
	}

	return (
		<Layout>
			<h1>data</h1>
			<TeamDataTable data={data} />
		</Layout>
	);
};

export default Home;
