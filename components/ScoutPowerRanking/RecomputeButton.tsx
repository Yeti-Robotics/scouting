'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function RecomputeButton() {
	const router = useRouter();
	return (
		<Button
			className='mt-4 w-full'
			variant='default'
			onClick={() => {
				fetch('/api/spr/recompute', { method: 'POST' }).then(() => router.refresh());
			}}
		>
			RECOMPUTE SPR
		</Button>
	);
}

export default RecomputeButton;
