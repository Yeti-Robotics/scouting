import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface QuickStatI {
	label: string;
	value: number;
	popoverContent: string;
}

/**
 * Renders a QuickStat component.
 *
 * @param props - The component props.
 * @param props.stat - The QuickStat object containing the label, popover content, and value.
 * @returns The rendered QuickStat component.
 */
function QuickStat({ stat }: { stat: QuickStatI }) {
	return (
		<div className='px-2'>
			<Popover>
				<PopoverTrigger asChild>
					<p className='select-none text-center  font-bold underline decoration-dotted hover:cursor-pointer'>
						{stat.label}
					</p>
				</PopoverTrigger>
				<PopoverContent className='w-min  whitespace-nowrap text-center'>
					<p>{stat.popoverContent}</p>
				</PopoverContent>
				<p className='text-center'>{stat.value.toFixed(2)}</p>
			</Popover>
		</div>
	);
}

/**
 * Renders a list of QuickStats components.
 *
 * @param props - The component props.
 * @param props.stats - The QuickStat objects to render.
 * @returns The rendered QuickStats component.
 */
export default function QuickStats({ stats }: { stats: QuickStatI[] }) {
	return (
		<div className='flex space-x-2'>
			{stats.map((stat, i) => (
				<QuickStat key={i} stat={stat} />
			))}
		</div>
	);
}
