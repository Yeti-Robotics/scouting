import { useRef } from 'react';
import { Group, ActionIcon, NumberInputHandlers, NumberInputProps } from '@mantine/core';
import { Control, FieldValues, Path } from 'react-hook-form';
import { ControlledNumberInput } from './ControlledNumberInput';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
} & NumberInputProps;

export const ScoreInput = <T extends FieldValues>({ control, name, ...props }: Props<T>) => {
	const handlers = useRef<NumberInputHandlers>();

	return (
		<Group spacing={5}>
			<ActionIcon size={42} variant='default' onClick={handlers.current?.decrement}>
				-
			</ActionIcon>

			<ControlledNumberInput
				{...props}
				hideControls
				control={control}
				name={name}
				handlersRef={handlers}
				styles={{ input: { width: 54, textAlign: 'center' } }}
			/>

			<ActionIcon size={42} variant='default' onClick={handlers.current?.increment}>
				+
			</ActionIcon>
		</Group>
	);
};
