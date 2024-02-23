import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NumericalInput from '../numerical-input';
import { PersonIcon } from '@radix-ui/react-icons';
import { MissedNote } from '@/components/icons';

export default function Teleop() {
	return (
		<Card className='container px-2 py-4'>
			<CardHeader className='mb-2 flex flex-row space-x-2'>
				<PersonIcon className='h-8 w-8' />
				<div>
					<CardTitle>Teleop</CardTitle>
					<CardDescription>Bot actions in teleop</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='flexrow flex'>
					<img src='/amp-icon.png' width='40' className='ml-1 mr-5' />
					<NumericalInput
						category='teleop'
						name='ampNotes'
						placeholder='Amp Notes Scored'
					/>
				</div>
				<div className='flexrow flex'>
					<img src='/speaker-icon.png' width='48' className='mr-4 pt-4' />
					<NumericalInput
						category='teleop'
						name='speakerNotes'
						placeholder='Speaker Notes Scored'
					/>
				</div>
				<div className='flexrow flex'>
					<img src='/amped-speaker-icon.png' width='48' className='mr-4 pt-4' />
					<NumericalInput
						category='teleop'
						name='amplifiedSpeakerNotes'
						placeholder='Amplified Speaker Notes Scored'
					/>
				</div>
				<div className='flexrow flex'>
					<div className='mr-4 pt-4'>
						<MissedNote />
					</div>
					<NumericalInput
						category='teleop'
						name='notesMissed'
						placeholder='Notes Missed'
					/>
				</div>
			</CardContent>
		</Card>
	);
}
