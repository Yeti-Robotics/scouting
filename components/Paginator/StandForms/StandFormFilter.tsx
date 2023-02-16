import { ControlledNumberInput } from '@/components/Forms/ControlledNumberInput';
import { ControlledSelect } from '@/components/Forms/ControlledSelect';
import { NumberSelect } from '@/components/Forms/NumberSelect';
import { StandFormI } from '@/models/StandForm';
import { Button, Checkbox, Paper, TextInput, Title } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { sanitizeFilter } from '../filterHelpers';
import { FilterProps } from '../Paginator';

type Spread<T extends object> = T[keyof T];

const StandFormFilter = ({ state }: FilterProps<StandFormI>) => {
	const [query, setQuery] = state;
	const {
		control,
		handleSubmit,
		watch,
		register,
		reset: resetForm,
	} = useForm({
		defaultValues: {
			...query.filter,
			sortBy: Object.keys(query.sort)[0],
			sortFrom: (query.sort as { [key: string]: Spread<StandFormI> })[
				Object.keys(query.sort)[0]
			],
		},
	});
	const sortBy = watch('sortBy');

	const onSubmit: SubmitHandler<
		Partial<StandFormI> & { sortBy: string; sortFrom: Spread<StandFormI> }
	> = (data) => {
		const { sortBy, sortFrom, ...filter } = sanitizeFilter(data);
		const newSort: any = {};
		newSort[sortBy] = sortFrom;
		setQuery({ filter, sort: newSort });
	};

	const reset = () => {
		setQuery({ filter: {}, sort: { createdAt: -1 } });
		resetForm();
	};

	return (
		<Paper
			component='form'
			withBorder
			shadow='xl'
			p='md'
			sx={{ display: 'flex', flexDirection: 'column' }}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Title order={2}>Sort</Title>
			<ControlledSelect
				control={control}
				data={[
					{ value: 'createdAt', label: 'Submission Time' },
					{ value: '_id', label: 'id' },
				]}
				name='sortBy'
				label='Sort By'
			/>

			<NumberSelect
				control={control}
				data={[
					{
						value: 1,
						label:
							sortBy === 'createdAt' || sortBy === 'updatedAt'
								? 'most recent to least recent'
								: 'low to high',
					},
					{
						value: -1,
						label:
							sortBy === 'createdAt' || sortBy === 'updatedAt'
								? 'least recent to most recent'
								: 'high to low',
					},
				]}
				name='sortFrom'
				label='Sort From'
			/>
			<Title order={2}>Filter</Title>
			<Checkbox {...register('approved', { validate: undefined })} label='Approved' />
			<ControlledNumberInput control={control} name='matchNumber' label='Match Number' />
			<ControlledNumberInput control={control} name='teamNumber' label='Team Number' />
			<TextInput
				{...register('scouter.firstName', { validate: () => true, required: false })}
				label='Scouter First Name'
			/>
			<TextInput
				{...register('scouter.lastName', { validate: () => true, required: false })}
				label='Scouter Last Name'
			/>
			<Button variant='contained' onClick={reset} mt='md'>
				Reset Filters
			</Button>
			<Button type='submit' mt='md'>
				Update
			</Button>
		</Paper>
	);
};

export default StandFormFilter;
