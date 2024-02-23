'use client';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormContext } from '@/components/Forms/StandForm';
import { useContext } from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';

export default function Misc() {
	const form = useContext(FormContext);

	if (!form) return null;

	return (
		<>
			<CardHeader className='mb-2 flex flex-row space-x-2'>
				<DotsHorizontalIcon className='h-8 w-8' />
				<div>
					<CardTitle>Miscellaneous</CardTitle>
					<CardDescription>Other info</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-2'>
				<FormField
					control={form.control}
					name='defense'
					render={({ field }) => (
						<FormItem>
							<FormLabel
								htmlFor='defense'
								className='text-sm font-medium leading-none'
							>
								Rate Defense
							</FormLabel>
							<Select
								value={field.value.toString()}
								onValueChange={(v) => field.onChange(Number(v))}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Rate Defense' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value='0'>No Defense</SelectItem>
										<SelectItem value='1'>1 - Ineffective</SelectItem>
										<SelectItem value='2'>2</SelectItem>
										<SelectItem value='3'>3 - Mid</SelectItem>
										<SelectItem value='4'>4</SelectItem>
										<SelectItem value='5'>5 - Lockdown</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<div className='pt-1'>
					<FormField
						control={form.control}
						name='notes'
						rules={{ required: 'A note is required' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='miscNotes'>Miscellaneous Notes</FormLabel>
								<p className='muted'>
									Give some more insight into the match such as: strategy, robot
									status (disabled, broken), and human players. Don't write too
									much, be concise!
								</p>
								<Textarea
									placeholder='Write some notes...'
									{...field}
									className='w-full'
								/>
							</FormItem>
						)}
					/>
				</div>
			</CardContent>
		</>
	);
}
