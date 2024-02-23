import { Control, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateStandForm } from '@/models/StandForm';
import { useContext, useEffect } from 'react';
import { FormContext } from '..';
import { CheckedState } from '@radix-ui/react-checkbox';

interface CheckboxProps<T extends FieldValues> {
	name: keyof CreateStandForm;
	label: string;
}

export default function FormCheckbox<T extends FieldValues>({ name, label }: CheckboxProps<T>) {
	const form = useContext(FormContext);

	if (!form) return null;

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className='flex items-center space-x-2 space-y-0'>
					<Checkbox
						className='m-0 h-6 w-6'
						checked={field.value as CheckedState}
						onCheckedChange={field.onChange}
					/>
					<FormLabel htmlFor={name}>{label}</FormLabel>
				</FormItem>
			)}
		></FormField>
	);
}
