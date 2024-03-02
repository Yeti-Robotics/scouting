'use client';

import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputHTMLAttributes } from 'react';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';

type Props<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> &
	UseControllerProps<T> & { label?: string };

export default function NumericalInput<T extends FieldValues>({
	name,
	control,
	required,
	...props
}: Props<T>) {
	const { field } = useController({
		name,
		control,
		rules: { required, min: props.min, max: props.max },
	});

	function handleChange(v: number) {
		if (props.min !== undefined && v < Number(props.min)) return;
		if (props.max !== undefined && v > Number(props.max)) return;
		field.onChange(v);
	}

	return (
		<div className='w-full space-y-1'>
			{props.label && <FormLabel htmlFor={name}>{props.label}</FormLabel>}
			<div className='flex w-full items-end space-x-2'>
				<Button
					onClick={() => handleChange(field.value - 1)}
					type='button'
					variant='outline'
				>
					-
				</Button>
				<div className='grid grow gap-1'>
					<Input
						type='number'
						name={name}
						className='block w-full grow text-center text-foreground'
						value={field.value}
						disabled
						{...props}
					/>
				</div>
				<Button onClick={() => handleChange(field.value + 1)} type='button'>
					+
				</Button>
			</div>
		</div>
	);
}
