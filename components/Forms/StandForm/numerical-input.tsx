import { useContext } from 'react';
import { FormContext, ValueKeysT } from '@/components/Forms/StandForm/Tabs/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NumericalInput({
	name,
	category,
	placeholder,
}: {
	name: string;
	category: ValueKeysT;
	placeholder: string;
}) {
	const { values, setValues } = useContext(FormContext);
	type NameT = keyof (typeof values)[typeof category];
	function handleChange(didDecrement: boolean = false) {
		if (setValues) {
			setValues((curr: typeof values) => {
				const cat = curr[category];
				return {
					...curr,
					[category]: {
						...cat,
						[name as NameT]: didDecrement
							? Math.max(0, curr[category][name as NameT] - 1)
							: curr[category][name as NameT] + 1,
					},
				};
			});
		}
	}

	return (
		<div className='space-y-1'>
			<Label htmlFor='ampNotes'>{placeholder}</Label>
			<div className='flex space-x-3'>
				<Button type='button' variant='outline' onClick={() => handleChange(true)}>
					-
				</Button>
				<Input
					name={name}
					className='w-32 text-center'
					disabled
					value={values[category][name as NameT]}
				/>
				<Button type='button' onClick={() => handleChange()}>
					+
				</Button>
			</div>
		</div>
	);
}
