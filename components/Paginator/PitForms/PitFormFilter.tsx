import { ControlledNumberInput } from '@/components/Forms/ControlledNumberInput';
import { ControlledSelect } from '@/components/Forms/ControlledSelect';
import { NumberSelect } from '@/components/Forms/NumberSelect';
import { PitFormI } from '@/models/PitForm';
import { Button, Group, Paper, Stack, TextInput, Title } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { sanitizeFilter } from '../filterHelpers';
import { FilterProps } from '../Paginator';

type Spread<T extends object> = T[keyof T];

const PitFormFilter = ({ state }: FilterProps<PitFormI>) => {
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
			sortFrom: (query.sort as { [key: string]: Spread<PitFormI> })[
				Object.keys(query.sort)[0]
			],
		},
	});
	const sortBy = watch('sortBy');

	const onSubmit: SubmitHandler<
		Partial<PitFormI> & { sortBy: string; sortFrom: Spread<PitFormI> }
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
			onSubmit={handleSubmit(onSubmit)}
			withBorder
			shadow='xl'
			p='md'
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<Title order={1}>Sort</Title>
			<Group align='center' position='center'>
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
			</Group>
			<Title pt='md' order={1}>
				Filter
			</Title>
			<Group align='center' position='center' mb='md'>
				<ControlledNumberInput
					control={control}
					name='teamNumber'
					label='Team Number'
					rules={{ required: false }}
				/>
				<TextInput
					{...register('scouter', { validate: () => true, required: false })}
					label='Scouter Username'
				/>
			</Group>
			<Stack>
				<Button onClick={reset} sx={{ mb: 2 }}>
					Reset Filters
				</Button>
				<Button type='submit'>Update</Button>
			</Stack>
		</Paper>
	);
};

export default PitFormFilter;
