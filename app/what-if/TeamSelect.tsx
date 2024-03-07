'use client';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TeamI } from '@/models/Team';

interface TeamSelectProps {
	teams: TeamI[];
	value: string;
	setValue: (value: string) => void;
}

export default function TeamSelect({ teams, value, setValue }: TeamSelectProps) {
	return (
		<Select value={value} onValueChange={setValue}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Select a Team' />
			</SelectTrigger>
			<SelectContent>
				{teams.map((team, index) => (
					<SelectItem key={index} value={`${team.team_number}`}>
						{team.team_number} - {team.team_name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
