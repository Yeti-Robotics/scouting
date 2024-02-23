import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NumericalInput from '../numerical-input';
import { CodeIcon } from '@radix-ui/react-icons';
import { Checkbox } from '@/components/ui/checkbox';
import { MissedNote } from '@/components/icons';

export default function Auto() {
	return (
		<Card className='container px-2 py-4'>
			<CardHeader className='mb-2 flex flex-row space-x-2'>
				<CodeIcon className='h-8 w-8' />
				<div>
					<CardTitle>Autonomous</CardTitle>
					<CardDescription>Bot actions in autonomous</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='flex items-center space-x-2 pb-2'>
					<Checkbox id='preload' className='mr-2 h-6 w-6' />
					<label
						htmlFor='preload'
						className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
					>
						Preloaded?
					</label>
				</div>
				<div className='flex items-center space-x-2 pb-2'>
					<Checkbox id='initiationLine' className='mr-2 h-6 w-6' />
					<label
						htmlFor='initiationLine'
						className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
					>
						Passed the white line?
					</label>
				</div>
				<div className='flexrow flex'>
					<img src='/amp-icon.png' width='40' className='mr-5 ml-1' />
					<NumericalInput
						category='auto'
						name='ampNotes'
						placeholder='Amp Notes Scored'
					/>
				</div>
				<div className='flexrow flex'>
					<img src='/speaker-icon.png' width='48' className='mr-4 pt-4' />
					<NumericalInput
						category='auto'
						name='speakerNotes'
						placeholder='Speaker Notes Scored'
					/>
				</div>
				<div className='flexrow flex'>
					<div className='mr-4 pt-4'>
						<MissedNote />
					</div>
					<NumericalInput category='auto' name='notesMissed' placeholder='Notes Missed' />
				</div>
			</CardContent>
		</Card>
	);
}
