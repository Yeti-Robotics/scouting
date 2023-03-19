import { Group, ActionIcon, NumberInputProps, Input, NumberInput } from '@mantine/core';
import { Control, FieldValues, Path, useController, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	rules?: UseControllerProps<T>['rules'];
} & NumberInputProps;

export const ScoreInput = <T extends FieldValues>({
	control,
	name,
	label,
	rules,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({
		control,
		name,
		rules: { required: props.required, min: props.min, max: props.max, ...rules },
	});

	const change = (v: number) => {
		if (props.min !== undefined && v < props.min) return;
		if (props.max !== undefined && v > props.max) return;
		field.onChange(v);
	};

	return (
		<Input.Wrapper label={label} required={props.required}>
			<Group spacing={8}>
				<ActionIcon
					size={36}
					variant='default'
					onClick={() => change(typeof field.value !== 'number' ? -1 : field.value - 1)}
				>
					-
				</ActionIcon>

				<NumberInput
					maw={100}
					{...props}
					styles={{ input: { textAlign: 'center' } }}
					hideControls
					value={field.value}
					onChange={(v) => {
						if (v === '') v = 0;
						field.onChange(v);
						props.onChange?.(v);
					}}
					name={field.name}
					onBlur={field.onBlur}
					ref={field.ref}
					error={fieldState.error?.message}
					disabled
				/>

				<ActionIcon
					size={36}
					variant='default'
					onClick={() => change(typeof field.value !== 'number' ? 1 : field.value + 1)}
				>
					+
				</ActionIcon>
			</Group>
		</Input.Wrapper>
	);
};
