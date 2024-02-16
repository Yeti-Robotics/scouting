import { connectToDbB } from '@/middleware/connect-db';
import { CreateForm } from './crud-components';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import PickList, { PickListI } from '@/models/PickList';

/**
 * Renders a card for a picklist with a link to the picklist's page.
 * @param props.picklist - the picklist to display
 * @returns The rendered PicklistCard component.
 */
function PicklistCard({ picklist }: { picklist: PickListI }) {
	return (
		<Card key={picklist._id.toString()}>
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
				</div>
			</CardHeader>
		</Card>
	);
}

/**
 * Renders a list of picklists with links to each picklist's page.
 * @param props.picklists - the picklists to display
 * @returns The rendered PicklistList component.
 */
function PicklistList({ picklists }: { picklists: PickListI[] }) {
	return (
		<div className='grid grid-cols-1 gap-5'>
			{picklists
				.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
				.map((picklist) => {
					return <PicklistCard key={picklist._id.toString()} picklist={picklist} />;
				})}
		</div>
	);
}

/**
 * Responsible for rendering the Picklist management page.
 * @returns rendered PicklistPage component.
 */
export default async function PicklistPage() {
	await connectToDbB();
	const picklists = await PickList.find({});
	return (
		<main className='mx-auto mt-12 max-w-[540px]'>
			<h1 className='typography mb-6'>YETI Picklists</h1>
			<div className='my-4'>
				<CreateForm />
			</div>
			<PicklistList picklists={picklists} />
		</main>
	);
}
