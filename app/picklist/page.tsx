import StandForm from '@/models/StandForm';
import PickList from '@/models/PickList';
import PickListTable from '@/components/PicklistTable';
import { TeamAvgsI, PickabilityWeightsI } from '@/lib/types/Pickability';
import { avgDataPipeline } from '@/models/aggregations/averageData';
import { firstPickWeights, secondPickWeights } from '../../lib/analysis/pickability-weights';
import { connectToDbB } from '@/middleware/connect-db';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PicklistPage() {
	await connectToDbB();
	const picklists = await PickList.find({});
	console.log(picklists);
	return (
		<main className='mx-auto mt-12 max-w-[540px]'>
			<h1 className='typography mb-6'>YETI Picklists</h1>
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
