import { ValidationRule } from 'react-hook-form';

export const addRequired = (
	required: boolean | ValidationRule<boolean> | string | undefined,
	label: string,
) => (required ? label + '*' : label);
