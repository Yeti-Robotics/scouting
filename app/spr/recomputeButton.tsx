'use client';

import { useRouter } from 'next/navigation';

function RecomputeButton() {
	const router = useRouter();
	return (
		<button
			className='rounded-lg bg-yeti-blue p-2 font-bold text-white transition-all duration-200 hover:bg-bubble-gum hover:shadow-xl'
			onClick={() => {
				fetch('/api/spr/recompute', { method: 'POST' }).then(() => router.refresh());
			}}
		>
			RECOMPUTE SPR
		</button>
	);
}

export default RecomputeButton;
