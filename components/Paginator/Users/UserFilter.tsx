import { ControlledNumberInput } from '@/components/Forms/ControlledNumberInput';
import { ControlledSelect } from '@/components/Forms/ControlledSelect';
import { NumberSelect } from '@/components/Forms/NumberSelect';
import { UserI } from '@/models/User';
import { Button, Group, Paper, TextInput, Title } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { sanitizeFilter } from '../filterHelpers';
import { FilterProps } from '../Paginator';

type Spread<T extends object> = T[keyof T];

const UserFilter = ({ state }: FilterProps<UserI>) => {
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
			sortBy: Object.keys(query.sort)[0] ?? 'createdAt',
			sortFrom: (query.sort as { [key: string]: Spread<UserI> })[Object.keys(query.sort)[0]],
		},
	});
	const sortBy = watch('sortBy');

	const onSubmit: SubmitHandler<Partial<UserI> & { sortBy: string; sortFrom: Spread<UserI> }> = (
		data,
	) => {
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
			withBorder
			shadow='xl'
			p='md'
			component='form'
			sx={{ display: 'flex', flexDirection: 'column' }}
			onSubmit={handleSubmit(onSubmit)}
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
			<Group>
				<TextInput
					{...register('firstName', { validate: undefined, required: false })}
					label='First Name'
				/>
				<TextInput
					{...register('lastName', { validate: undefined, required: false })}
					label='Last Name'
				/>
				<TextInput
					{...register('username', { validate: undefined, required: false })}
					label='Username'
				/>
				<ControlledNumberInput control={control} name='teamNumber' label='Team Number' />
			</Group>
			<Button onClick={reset} mt='md'>
				Reset Filters
			</Button>
			<Button type='submit' mt='md'>
				Update
			</Button>
		</Paper>
	);
};

export default UserFilter;
