'use client';

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link1Icon } from '@radix-ui/react-icons';
import { ClimbContext, FormContext } from '@/components/Forms/StandForm';
import { useContext } from 'react';
import NumericalInput from '../numerical-input';
import FormCheckbox from '../FormElements/Checkbox';

export default function Endgame() {
	const form = useContext(FormContext);
	const { climb, park } = useContext(ClimbContext);
	if (!form) return null;

	return (
		<>
			<CardHeader className='mb-2 flex w-full flex-row space-x-2'>
				<Link1Icon className='h-8 w-8' />
				<div>
					<CardTitle>Endgame</CardTitle>
					<CardDescription>Bot actions in endgame</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='w-full space-y-4'>
				<NumericalInput
					label='Trap Notes Attempted'
					name='trapAttempts'
					control={form.control}
					min={0}
				/>
				<NumericalInput
					label='Trap Notes Scored'
					name='trapNotes'
					control={form.control}
					min={0}
					max={3}
				/>
				<div className='flex items-center space-x-2 pt-4'>
					<FormCheckbox name='climb' label='Climbed?' />
				</div>
				{climb && (
					<>
						<FormCheckbox name='spotlight' label='Spotlit?' />
						<NumericalInput
							label="Number of Robots on Your Robot's Chain (Including Your Robot)"
							name='numberOnChain'
							control={form.control}
							min={0}
							max={3}
						/>
					</>
				)}
				{!climb && (
					<div>
						<FormCheckbox name='park' label='Parked?' />
					</div>
				)}
			</CardContent>
		</>
	);
}
