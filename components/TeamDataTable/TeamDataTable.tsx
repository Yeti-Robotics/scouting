'use client';

import { ReactNode, useState } from 'react';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RawTeamData } from '@/models/aggregations/teamData';
import {
	Cell,
	getCoreRowModel,
	getSortedRowModel,
	Header,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { columns } from './columns';
import { CaretSortIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

interface TableScrollAreaProps {
	data: RawTeamData[];
}

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

export const TeamDataTable = ({ data }: TableScrollAreaProps) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable<RawTeamData>({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		state: { sorting },
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className='max-h-[512px] overflow-y-auto rounded-md border'>
			<table className='relative border-separate border'>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup, i) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => (
								<TableHead
									key={header.id}
									colSpan={header.colSpan}
									style={{ top: `${i * 40}px` }}
									className={`sticky z-30  bg-background px-0 ${header.column.getCanSort() ? 'cursor-pointer' : ''} ${(header.column.columnDef.meta as any)?.className ?? ''} ${index !== headerGroup.headers.length - 1 ? 'border-r' : ''}`}
									onClick={header.column.getToggleSortingHandler()}
								>
									{!header.isPlaceholder && (
										<div
											className={`flex h-full items-center border-r p-2 last:border-none ${(header.column.columnDef.meta as any)?.align === 'left' ? 'justify-start' : 'justify-end'} whitespace-nowrap`}
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
				<TableBody>
					{table.getRowModel().rows.map((row, index) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell, cellIndex) => (
								<TableCell
									className={`bg-background ${(cell.column.columnDef.meta as any)?.className} z-0 `}
									align={(cell.column.columnDef.meta as any)?.align}
									key={cell.id}
								>
									{renderCell(cell)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</table>
		</div>
	);
};
