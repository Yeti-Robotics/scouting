'use client';

import StandForm from '@/components/Forms/StandForm';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import fetcher from '@/lib/fetch';
import { CreateStandForm, StandFormI } from '@/models/StandForm';
import { UserI } from '@/models/User';
import useSWR from 'swr';

const StandFormPage = ({ params }: { params: { id: string } }) => {
	const { data: user, isLoading } = useSWR<UserI>('/api/auth/decode', fetcher, {
		refreshInterval: 5000,
	});
	const { data, error } = useSWR<StandFormI>(`/api/forms/stand/${params.id}`, fetcher);

	if (error) {
		return <h1>There was an error retrieving this form.</h1>;
	}

	if (!data?._id) {
		return <h1>No form was found with this id.</h1>;
	}

	return (
		<main className='mx-auto flex w-full max-w-[360px] flex-wrap items-center justify-center py-8'>
			<h1 className='typography mb-6 w-full'>Stand Form</h1>
			<StandForm
				create={false}
				canEdit={user?.administrator || user?._id === data.scouter?._id}
				defaultForm={data as unknown as CreateStandForm}
				id={String(params.id)}
			/>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant='outline' className='my-2 w-full bg-red-700'>
						Delete Form
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Awe you shure? 🥺</DialogTitle>
						<DialogDescription>Delete it????!??! 😱</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='default'>Go back 😭</Button>
						</DialogClose>
						<DialogClose>
							<Button
								variant='default'
								onClick={() => {
									fetch(`/api/forms/stand/${String(params.id)}`, {method: 'DELETE'});
								}}
								className='bg-red-700'
							>
								Delete it 😈
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default StandFormPage;
