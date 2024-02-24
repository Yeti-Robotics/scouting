'use client';

import useSWR from 'swr';
import fetcher from '@/lib/fetch';
import FormTabs from './Tabs';
import {
	createContext,
	useState,
	useContext,
	useEffect,
	SetStateAction,
	Dispatch,
	useMemo,
} from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateStandForm } from '@/models/StandForm';
import { Button } from '@/components/ui/button';
import { defaultValues } from './defaultValues';

import { UserI } from '@/models/User';
import { onSubmit } from './onSubmitNew';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import { MatchI } from '@/models/Match';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const getTeamsAsArr = (match: MatchI | null) =>
	[
		{ label: `Blue 1 - ${match?.blue1}`, value: match?.blue1 },
		{ label: `Blue 2 - ${match?.blue2}`, value: match?.blue2 },
		{ label: `Blue 3 - ${match?.blue3}`, value: match?.blue3 },
		{ label: `Red 1 - ${match?.red1}`, value: match?.red1 },
		{ label: `Red 2 - ${match?.red2}`, value: match?.red2 },
		{ label: `Red 3 - ${match?.red3}`, value: match?.red3 },
	].filter((team) => team.value !== undefined) as { label: string; value: number }[];

export const ClimbContext = createContext<Record<'climb' | 'park', boolean>>({
	climb: false,
	park: false,
});

export const FormContext = createContext<UseFormReturn<CreateStandForm, any> | null>(null);
interface StandFormProps {
	create: boolean;
	canEdit?: boolean;
	id?: string;
	defaultForm?: Partial<CreateStandForm>;
}

export default function StandForm({ create, canEdit, id, defaultForm }: StandFormProps) {
	const [submitting, setSubmitting] = useState<'' | 'fetching' | 'done'>('');
	const [match, setMatch] = useState<MatchI | null>(null);
	const { data: matches } = useSWR<MatchI[]>('/api/matches', fetcher);
	const { data: user, isLoading } = useSWR<UserI>('/api/auth/decode', fetcher, {
		refreshInterval: 5000,
	});

	const isOnline = useOnlineStatus();

	const form = useForm<CreateStandForm>({
		defaultValues: {
			...defaultValues,
			...defaultForm,
		},
	});

	const alliance = useMemo(() => {
		const teamNumber = form?.watch('teamNumber');
		if (
			match?.blue1 === teamNumber ||
			match?.blue2 === teamNumber ||
			match?.blue3 === teamNumber
		) {
			return 'blue';
		} else if (
			match?.red1 === teamNumber ||
			match?.red2 === teamNumber ||
			match?.red3 === teamNumber
		) {
			return 'red';
		}
		return '';
	}, [form?.watch('teamNumber')]);

	useEffect(() => {
		if (form.watch('climb')) {
			form.setValue('park', false);
		}
		if (form.watch('park')) {
			form.setValue('climb', false);
		}
	}, [form.watch('climb'), form.watch('park')]);

	if (isLoading) return <p>Loading...</p>;

	return (
		<Form {...form}>
			<form
				className='w-full'
				onSubmit={form.handleSubmit(
					onSubmit(create, user, form.reset, isOnline, setSubmitting, alliance),
				)}
			>
				<FormContext.Provider value={form}>
					<StandFormTopFields
						create={create}
						matches={matches}
						match={match}
						setMatch={setMatch}
					/>
					<ClimbContext.Provider
						value={{
							climb: form.watch('climb'),
							park: form.watch('park'),
						}}
					>
						<FormTabs />
					</ClimbContext.Provider>
				</FormContext.Provider>
				<Button
					className='mt-4 w-full'
					type='submit'
					variant='default'
					disabled={submitting === 'fetching'}
				>
					Submit
				</Button>
			</form>
		</Form>
	);
}

interface StandFormTopFieldsProps {
	create: boolean;
	matches: MatchI[] | undefined;
	match: MatchI | null;
	setMatch: Dispatch<SetStateAction<MatchI | null>>;
}

function StandFormTopFields({ create, matches, match, setMatch }: StandFormTopFieldsProps) {
	const form = useContext(FormContext);
	const matchNumber = form?.watch('matchNumber');

	useEffect(() => {
		if (!create || !matches) return;
		setMatch(matches.find((match) => match.matchNumber === Number(matchNumber)) || null);
	}, [matchNumber]);

	if (!form) return null;
	return (
		<div className='mb-2 grid grid-cols-2 gap-4'>
			<FormItem>
				<FormLabel>Match Number</FormLabel>
				<FormControl>
					<Input type='number' placeholder='XX' {...form.register('matchNumber')} />
				</FormControl>
				<FormMessage />
			</FormItem>
			<FormField
				control={form.control}
				name='teamNumber'
				rules={{ required: 'Team Number is required' }}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Team Number</FormLabel>
						<Select
							value={field.value?.toString() || ''}
							onValueChange={(v) => field.onChange(Number(v))}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Team Number' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{getTeamsAsArr(match).map((team) => (
										<SelectItem key={team.value} value={team.value.toString()}>
											{team.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>
		</div>
	);
}
