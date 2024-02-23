'use client';
import Image from 'next/image';
import NumericalInput from '../numerical-input';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeIcon } from '@radix-ui/react-icons';
import { FormContext } from '@/components/Forms/StandForm';
import { MissedNote } from '@/components/icons';
import { useContext } from 'react';
import FormCheckbox from '../FormElements/Checkbox';

export default function Auto() {
	const form = useContext(FormContext);

	if (!form) return null;

	return (
		<>
			<CardHeader className='mb-2 flex flex-row space-x-2'>
				<CodeIcon className='h-8 w-8' />
				<div>
					<CardTitle>Autonomous</CardTitle>
					<CardDescription>Bot actions in autonomous</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-2'>
					<FormCheckbox name='preload' label='Preloaded?' />
					<FormCheckbox name='initiationLine' label='Moved off line?' />
				</div>
				<div className='flex'>
					<Image
						src='/amp-icon.png'
						width={40}
						height={40}
						alt='amp icon'
						className='ml-1 mr-5'
					/>
					<NumericalInput
						label='Amp Notes Made'
						name='autoAmpNotes'
						control={form.control}
						min={0}
					/>
				</div>
				<div className='flexrow flex'>
					<Image
						src='/speaker-icon.png'
						alt='speaker icon'
						width='48'
						height='48'
						className='mr-4 pt-4'
					/>
					<NumericalInput
						label='Speaker Notes Made'
						name='autoSpeakerNotes'
						control={form.control}
						min={0}
					/>
				</div>
				<div className='flexrow flex'>
					<div className='mr-4 pt-4'>
						<MissedNote />
					</div>
					<NumericalInput
						label='Notes Missed'
						name='autoNotesMissed'
						control={form.control}
						min={0}
					/>
				</div>
			</CardContent>
		</>
	);
}
