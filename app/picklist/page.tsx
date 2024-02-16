import { connectToDbB } from '@/middleware/connect-db';
import { Button } from '@/components/ui/button';
import { CreateForm } from './crud-components';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import PickList from '@/models/PickList';

export default async function PicklistPage() {
	await connectToDbB();
	const picklists = await PickList.find({});
	return (
		<main className='mx-auto mt-12 max-w-[540px]'>
			<h1 className='typography mb-6'>YETI Picklists</h1>
			<div className='my-4'>
				<CreateForm />
			</div>
			<div className='grid grid-cols-1 gap-5'>
				{picklists
					.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
					.map((picklist) => {
						return (
							<Card>
								<CardHeader>
									<div className='flex'>
										<div className='grow'>
											<CardTitle className='duration-250 transition-colors hover:text-primary'>
												<Link href={`/picklist/${picklist._id.toString()}`}>
													{picklist.name}
												</Link>
											</CardTitle>
											<CardDescription>
												Updated • {picklist.updatedAt.toDateString()}
											</CardDescription>
										</div>
										<Link href={`/picklist/${picklist._id.toString()}`}>
											<Button variant='link'>View</Button>
										</Link>
									</div>
								</CardHeader>
							</Card>
						);
					})}
			</div>
		</main>
	);
}
