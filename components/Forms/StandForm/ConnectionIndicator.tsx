import { useFirstRender } from '@/lib/useFirstRender';
import { Box } from '@mantine/core';
import { useEffect, useRef } from 'react';

interface Props {
	isOffline: boolean;
}

const ConnectionIndicator: React.VFC<Props> = ({ isOffline }) => {
	const ref = useRef<HTMLDivElement>(null);
	const timeout = useRef<NodeJS.Timeout>();
	const isFirstRender = useFirstRender();

	useEffect(() => {
		if (isFirstRender) return;
		if (!ref.current) return;
		if (timeout.current) clearTimeout(timeout.current);
		ref.current.style.top = '0';
		timeout.current = setTimeout(() => {
			if (!ref.current) return;
			ref.current.style.top = '-12rem';
		}, 10000);
	}, [isOffline]);

	return (
		<Box
			ref={ref}
			onClick={() => {
				if (!ref.current) return;
				ref.current.style.top = '-12rem';
			}}
			sx={{
				position: 'fixed',
				top: '-12rem',
				transition: 'top 0.3s ease',
				backgroundColor: 'text.primary',
				color: 'background.paper',
				padding: 2,
				margin: 2,
				zIndex: 999,
			}}
		>
			<h4 style={{ margin: 0 }}>
				{isOffline
					? 'You just went offline. Any forms you submit will be saved on your device and submitted when you have an internet connection. Be sure to keep this page open. Click me to dismiss.'
					: 'You are back online, any forms you may have submitted while offline were automagically submitted. Click me to dismiss.'}
			</h4>
		</Box>
	);
};

export default ConnectionIndicator;
