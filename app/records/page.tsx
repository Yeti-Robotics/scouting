'use client';

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
import { UserI } from '@/models/User';
import useSWR from 'swr';
import fetcher from '@/lib/fetch';
import { Link } from '@/components/Link';

export default function Recordss() {
	const { data: user, isLoading } = useSWR<UserI>('/api/auth/decode', fetcher, {
		refreshInterval: 5000,
	});

	return (
		<main className='mx-auto mt-12 max-w-[540px]'>
			<header>
				<h1 className='typography mb-6 ml-2'>Records</h1>
			</header>
			<div className='grid grid-cols-2 gap-1'>
				<Button variant='outline' className='m-2' asChild>
					<Link href='/records/stand-forms'>Stand Forms</Link>
				</Button>
				<Button variant='outline' className='m-2'>
					<Link href='/records/pit-forms'>Pit Forms</Link>
				</Button>
			</div>
			<div className='grid grid-cols-2 gap-1'>
				{user?.administrator && (
					<Button variant='outline' className='m-2'>
						<Link href='/records/users'>Users</Link>
					</Button>
				)}
				<Button variant='outline' className='m-2'>
					<Link href='/records/verify-forms'>Verify Match Forms</Link>
				</Button>
			</div>
			<div className='grid grid-cols-2 gap-1'>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='outline' className='m-2'>
							Clean DB
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Awe you shure? 🥺</DialogTitle>
							<DialogDescription>Delete everything????!??! 😱</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant='default'>Go back 😭</Button>
							</DialogClose>
							<DialogClose>
								<Button
									variant='default'
									onClick={() => {
										fetch('/api/clean-db');
									}}
								>
									Delete it all 😈
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='outline' className='m-2'>
							Approve Stand Forms
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Awe you shure? 🥺</DialogTitle>
							<DialogDescription>
								Approve all stand forms????!??! 😱
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant='default'>Go back 😭</Button>
							</DialogClose>
							<DialogClose>
								<Button
									variant='default'
									onClick={() => {
										fetch('/api/approve-all');
									}}
								>
									Approve them all 😈
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</main>
	);
}
