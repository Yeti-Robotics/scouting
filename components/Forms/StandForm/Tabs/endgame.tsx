'use client';

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link1Icon } from '@radix-ui/react-icons';
import { ClimbContext, FormContext } from '@/components/Forms/StandForm';
import { useContext } from 'react';
import NumericalInput from '../numerical-input';
import FormCheckbox from '../FormElements/Checkbox';

export default function Endgame() {
	const form = useContext(FormContext);
	const climbed = useContext(ClimbContext);
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
				<div className='flex items-center space-x-2 pt-4'>
					<FormCheckbox name='climb' label='Climbed?' />
				</div>
				{climbed && (
					<>
						<FormCheckbox name='spotlight' label='Spotlit?' />
						<NumericalInput
							label='Number of Robots on Chain'
							name='numberOnChain'
							control={form.control}
							min={0}
							max={3}
						/>
					</>
				)}
			</CardContent>
		</>
	);
}
