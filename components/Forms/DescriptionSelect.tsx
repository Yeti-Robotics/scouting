import { forwardRef } from 'react';
import { Text, Select, SelectProps, SelectItem } from '@mantine/core';

export type DescriptionSelectItem = {
	description?: string;
} & SelectItem;

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<'div'> & DescriptionSelectItem
>(({ label, description, ...others }, ref) => (
	<div ref={ref} {...others}>
		<Text size='sm'>{label}</Text>
		{description && (
			<Text size='xs' variant='dimmed'>
				{description}
			</Text>
		)}
	</div>
));

export type DescriptionSelectProps = {
	data: (string | DescriptionSelectItem)[];
} & Omit<SelectProps, 'data'>;

export const DescriptionSelect = forwardRef<HTMLInputElement, DescriptionSelectProps>(
	function DescriptionSelect(props, ref) {
		return (
			<Select
				{...props}
				ref={ref}
				itemComponent={SelectItem}
				filter={(value, item) =>
					item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
					item.description?.toLowerCase().includes(value.toLowerCase().trim())
				}
			/>
		);
	},
);
