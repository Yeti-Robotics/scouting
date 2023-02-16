import { useState } from 'react';
import { Group, ActionIcon, NumberInputProps, Input } from '@mantine/core';
import { Control, FieldValues, Path, UseControllerProps } from 'react-hook-form';
import { ControlledNumberInput } from './ControlledNumberInput';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	rules?: UseControllerProps<T>['rules'];
} & NumberInputProps;

export const ScoreInput = <T extends FieldValues>({ control, name, label, ...props }: Props<T>) => {
	const [value, _setValue] = useState<number | ''>(0);

	// Value must be greater than or equal to 0
	const setValue = (number: (number: number | '') => number) => {
		const newVal = number(value);
		if (newVal < 0) _setValue(0);
		else _setValue(newVal);
	};

	return (
		<Input.Wrapper label={label} required={props.required}>
			<Group spacing={8}>
				<ActionIcon
					size={42}
					variant='default'
					onClick={() => setValue((prev) => (typeof prev === 'string' ? -1 : prev - 1))}
				>
					-
				</ActionIcon>

				<ControlledNumberInput
					{...props}
					hideControls
					value={value}
					onChange={_setValue}
					control={control}
					name={name}
				/>

				<ActionIcon
					size={42}
					variant='default'
					onClick={() => setValue((prev) => (typeof prev === 'string' ? 1 : prev + 1))}
				>
					+
				</ActionIcon>
			</Group>
		</Input.Wrapper>
	);
};
