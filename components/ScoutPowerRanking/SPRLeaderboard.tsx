'use client';

import { ReactNode, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Cell,
	getCoreRowModel,
	getSortedRowModel,
	Header,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { CaretSortIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { columns } from './columns';
import { ScoutI } from '@/app/spr/page';

const renderHeader = <T, V>(header: Header<T, V>) => {
	return typeof header.column.columnDef.header === 'function'
		? header.column.columnDef.header(header.getContext())
		: header.column.columnDef.header;
};

const renderCell = <T, V>(cell: Cell<T, V>) => {
	return typeof cell.column.columnDef.cell === 'function'
		? cell.column.columnDef.cell(cell.getContext())
		: cell.column.columnDef.header;
};

const sortSymbols: { [key: string]: ReactNode } = {
	false: <CaretSortIcon />,
	asc: <ChevronUpIcon />,
	desc: <ChevronDownIcon />,
};

const SPRLeaderboard = ({ data }: { data: ScoutI[] }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable<ScoutI>({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		state: { sorting },
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className=' overflow-x-auto'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup, i) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										className={`px-0 ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
										onClick={header.column.getToggleSortingHandler()}
									>
										{!header.isPlaceholder && (
											<div
												className={`flex h-full items-center border-x p-2 ${(header.column.columnDef.meta as any)?.align === 'left' ? 'justify-start' : 'justify-end'} whitespace-nowrap`}
											>
												{renderHeader(header)}
												{header.column.getCanSort() &&
													(sortSymbols[
														header.column.getIsSorted() as string
													] ??
														null)}
											</div>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className='c [&>*:nth-child(odd)]:bg-muted/25'>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										align={(cell.column.columnDef.meta as any)?.align}
										key={cell.id}
									>
										{renderCell(cell)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default SPRLeaderboard;
