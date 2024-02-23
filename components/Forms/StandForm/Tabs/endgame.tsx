'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NumericalInput from '../numerical-input';
import { Link1Icon } from '@radix-ui/react-icons';
import { Checkbox } from '@/components/ui/checkbox';

export default function Endgame() {
	return (
		<Card className='container py-4'>
			<CardHeader className='mb-2 flex flex-row space-x-2'>
				<Link1Icon className='h-8 w-8' />
				<div>
					<CardTitle>Endgame</CardTitle>
					<CardDescription>Bot actions in endgame</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-2'>
				<NumericalInput
					category='endgame'
					name='trapNotesAttempted'
					placeholder='Trap Notes Attempted'
				/>
				<NumericalInput
					category='endgame'
					name='trapNotes'
					placeholder='Trap Notes Scored'
				/>
				<div className='flex items-center space-x-2 pt-4'>
					<Checkbox id='climb' className='mr-2 h-6 w-6' />
					<label
						htmlFor='climb'
						className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
					>
						Climbed?
					</label>
				</div>
			</CardContent>
		</Card>
	);
}
