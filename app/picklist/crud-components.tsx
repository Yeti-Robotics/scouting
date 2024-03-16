'use client';

import { FormEvent, useContext, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TeamsContext } from './[slug]/team-context-provider';
import {
	DialogContent,
	DialogTitle,
	Dialog,
	DialogHeader,
	DialogTrigger,
	DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/navigation';
import { deletePicklist, updatePicklist } from './[slug]/PicklistTable/actions';

interface CreateFormResponseI {
	insert_id: string;
}

export function CreateForm() {
	const [disabled, setDisabled] = useState(false);
	const router = useRouter();

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setDisabled(true);
		const data = new FormData(event.currentTarget);
		const pickListName = data.get('pickList_name')?.toString();
		if (!pickListName || pickListName.length === 0) {
			alert('Please enter a valid picklist name.');
			setDisabled(false);
			return;
		}
		fetch('/api/picklist', {
			method: 'POST',
			body: JSON.stringify({
				name: data.get('pickList_name'),
			}),
		})
			.then((res) => res.json())
			.then((res: CreateFormResponseI) => {
				router.push(`/picklist/${res.insert_id}`);
			})
			.catch((err) => {
				alert('There was an error submitting the form. Please try again.');
				setDisabled(false);
			});
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>Create Picklist</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Create a Picklist</DialogTitle>
					<DialogDescription>
						Once you choose a name you will be unable to change it.
					</DialogDescription>
				</DialogHeader>
				<form className='grid gap-4' onSubmit={handleSubmit}>
					<Label htmlFor='pickList_name'>Picklist Name</Label>
					<Input type='text' name='pickList_name' placeholder='Name' />
					<Button disabled={disabled} className='w-min' type='submit'>
						Create Picklist
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export function UpdateButton({ mongoId }: { mongoId: string }) {
	const { items } = useContext(TeamsContext);
	const [isPending, startTransition] = useTransition();
	return (
		<>
			<Button
				variant={'default'}
				disabled={isPending}
				className='w-32'
				onClick={async () => {
					startTransition(() => {
						updatePicklist(items, mongoId);
					});
				}}
			>
				{isPending ? 'Saving...' : 'Save Picklist'}
			</Button>
		</>
	);
}

export function DeleteButton({ mongoId }: { mongoId: string }) {
	const [isPending, startTransition] = useTransition();
	return (
		<>
			<Button
				variant={'default'}
				disabled={isPending}
				className='w-32'
				onClick={async () => {
					startTransition(() => {
						deletePicklist(mongoId);
					});
				}}
			>
				{isPending ? 'Deleting...' : 'Delete Picklist'}
			</Button>
		</>
	);
}