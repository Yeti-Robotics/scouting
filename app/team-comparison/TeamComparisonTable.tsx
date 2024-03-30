'use client';

import { ReactNode, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RawTeamData } from '@/models/aggregations/teamData';
import TeamSelect from '../what-if/TeamSelect';
import {
    Cell,
    createColumnHelper,
    getCoreRowModel,
    Header,
    useReactTable,
} from '@tanstack/react-table';
import { CaretSortIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
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
type TeamComparison = {
    team1: RawTeamData,
    team2: RawTeamData
}
const helper = createColumnHelper<TeamComparison>();

export const TeamComparisonTable = ({ data }: TableScrollAreaProps) => {
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");

    const [comparison, setComparison] = useState({ team1: data[0], team2: data[1] })

    const teams = data
        .map((team) => ({ team_number: team.teamNumber, team_name: team.teamName }))
        .sort((a, b) => a.team_number - b.team_number);

    return (
        <div className='max-h-screen overflow-auto rounded-md border'>
            <Table className='relative border-separate border-spacing-0 border'>
                <TableHeader>
                    <TableHead className='text-center border-r border-b'>
                        <div>
                            Team 1
                            <div className='text-center flex justify-center items-center'> <TeamSelect teams={teams} value={team1} setValue={setTeam1} /></div>
                        </div>
                    </TableHead>
                    <TableHead className='text-center border-r'>
                        <div className='text-center text-lg font-bold'>
                        Teams
                        </div>
                        </TableHead>
                    <TableHead className='text-center border-r border-b'>
                        <div>
                            Team 2
                            <div className='text-center flex justify-center items-center'> <TeamSelect teams={teams} value={team2} setValue={setTeam2} /></div>
                        </div>
                    </TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b'></TableHead>
                    <TableHead className='typography text-center font-semibold text-lg border-t'>Auto</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b border-r'></TableHead>
                    <TableHead className='typography text-center text-base border-t border-r'>Speaker</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b border-r'></TableHead>
                    <TableHead className='typography text-center text-base border-t border-r'>Amp</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b'></TableHead>
                    <TableHead className='typography text-center font-semibold text-lg border-t'>TeleOp</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b border-r'></TableHead>
                    <TableHead className='typography text-center text-base border-t border-r'>Speaker</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b border-r'></TableHead>
                    <TableHead className='typography text-center text-base border-t border-r'>Amp</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b'></TableHead>
                    <TableHead className='typography text-center font-semibold text-lg border-t'>Endgame</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b border-r'></TableHead>
                    <TableHead className='typography text-center text-base border-t border-r'>Trap Notes</TableHead>
                    <TableHead className='border-b'></TableHead>
                </TableHeader>
                <TableHeader>
                    <TableHead className='border-b border-r'></TableHead>
                    <TableHead className='typography text-center font-semibold text-lg border-t border-r'>Comments</TableHead>
                    <TableHead></TableHead>
                </TableHeader>
            </Table>
        </div>
    )
}