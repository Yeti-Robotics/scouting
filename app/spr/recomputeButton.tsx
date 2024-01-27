'use client';

function RecomputeButton() {
	return (
		<button
			className='bg-slate-500 border-red-100 border-1 dark:bg-red-500'
			onClick={() => {
				fetch('/api/spr/recompute', { method: 'POST' });
			}}
		>
			Recompute SPR
		</button>
	);
}

export default RecomputeButton;
