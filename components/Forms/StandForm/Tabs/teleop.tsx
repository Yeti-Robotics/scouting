'use client';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NumericalInput from '../numerical-input';
import { PersonIcon } from '@radix-ui/react-icons';
import { MissedNote, MissedNoteTeleop } from '@/components/icons';
import Image from 'next/image';
import { useContext } from 'react';
import { FormContext } from '@/components/Forms/StandForm';
import { IconRocket } from '@tabler/icons-react';

export default function Teleop() {
	const form = useContext(FormContext);

	if (!form) return null;

	return (
		<>
			<CardHeader className='mb-2 flex flex-row space-x-2'>
				<PersonIcon className='h-8 w-8' />
				<div>
					<CardTitle>Teleop</CardTitle>
					<CardDescription>Bot actions in teleop</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='flexrow flex'>
					<Image
						src='/amp-icon.png'
						width='40'
						height='40'
						alt='amp icon'
						className='ml-1 mr-5'
					/>
					<NumericalInput
						label='Amp Notes'
						name='teleopAmpNotes'
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
						label='Speaker Notes'
						name='teleopSpeakerNotes'
						control={form.control}
						min={0}
					/>
				</div>
				<div className='flexrow flex'>
					<Image
						alt='amplified speaker icon'
						src='/amped-speaker-icon.png'
						width='48'
						height='48'
						className='mr-4 pt-4'
					/>
					<NumericalInput
						label='Amped Speaker Notes'
						name='teleopAmplifiedSpeakerNotes'
						control={form.control}
						min={0}
					/>
				</div>
				<div className='flexrow flex'>
					<div className='mr-4 pt-4'>
						<MissedNoteTeleop />
					</div>
					<NumericalInput
						label='Notes Missed'
						name='teleopNotesMissed'
						control={form.control}
						min={0}
					/>
				</div>
				<div className='flexrow flex'>
					<div className='mr-4 pt-4'>
						<IconRocket className='h-12 w-12' />
					</div>
					<NumericalInput
						label='Shuttle Notes'
						name='shuttleNotes'
						control={form.control}
						min={0}
					/>
				</div>
			</CardContent>
		</>
	);
}
