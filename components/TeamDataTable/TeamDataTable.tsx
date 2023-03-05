import { ReactNode, useState } from 'react';
import { createStyles, Table, ScrollArea, rem, Box, Group } from '@mantine/core';
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
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
	header: {
		position: 'sticky',
		top: 0,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		transition: 'box-shadow 150ms ease',

		'&::after': {
			content: '""',
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			borderBottom: `${rem(1)} solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
			}`,
		},
	},

	scrolled: {
		boxShadow: theme.shadows.sm,
	},
}));

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
	asc: <IconChevronUp />,
	desc: <IconChevronDown />,
};

export const TeamDataTable = ({ data }: TableScrollAreaProps) => {
	const { classes, cx } = useStyles();
	const [scrolled, setScrolled] = useState(false);
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
		<ScrollArea mah={1000} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
			<Table striped highlightOnHover>
				<thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<Box
									component='th'
									key={header.id}
									maw={header.column.columnDef.maxSize}
									colSpan={header.colSpan}
									sx={{
										userSelect: header.column.getCanSort() ? 'none' : undefined,
										cursor: header.column.getCanSort() ? 'pointer' : undefined,
									}}
									onClick={header.column.getToggleSortingHandler()}
								>
									<Group spacing='xs' position='center' align='center'>
										{!header.isPlaceholder && renderHeader(header)}
										{!header.isPlaceholder &&
											(sortSymbols[header.column.getIsSorted() as string] ??
												null)}
									</Group>
								</Box>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<Box
									component='td'
									key={cell.id}
									maw={cell.column.columnDef.maxSize}
								>
									{renderCell(cell)}
								</Box>
							))}
						</tr>
					))}
				</tbody>
			</Table>
		</ScrollArea>
	);
};
