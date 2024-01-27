'use client';

function RecomputeButton() {
	return (
		<button
			onClick={() => {
				fetch('/api/spr/recompute', { method: 'POST' });
			}}
		>
			Recompute SPR
		</button>
	);
}

export default RecomputeButton;
