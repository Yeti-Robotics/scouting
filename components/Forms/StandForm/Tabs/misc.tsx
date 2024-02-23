import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NumericalInput from '../numerical-input';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Misc() {
	return (
		<Card className='container py-4'>
			<CardHeader className='mb-2 flex flex-row space-x-2'>
				<DotsHorizontalIcon className='h-8 w-8' />
				<div>
					<CardTitle>Miscellaneous</CardTitle>
					<CardDescription>Other info</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='space-y-2'>
				<label
					htmlFor='defense'
					className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
				>
					Rate Defense
				</label>
				<Select>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Rate Defense' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value='No Defense'>No Defense</SelectItem>
							<SelectItem value='1'>1 - Ineffective</SelectItem>
							<SelectItem value='2'>2</SelectItem>
							<SelectItem value='3'>3 - Mid</SelectItem>
							<SelectItem value='4'>4</SelectItem>
							<SelectItem value='5'>5 - Lockdown</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<NumericalInput
					category='misc'
					name='penalties'
					placeholder='Number of Penalties'
				/>
				<div className='pt-1'>
					<Label htmlFor='notes'>Notes</Label>
					<Textarea />
				</div>
				<p>
					Give some more insight into the match such as: strategy, robot status (disabled,
					broken), and human players. Don't write too much, be concise!
				</p>
			</CardContent>
		</Card>
	);
}
