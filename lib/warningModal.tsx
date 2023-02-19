import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';

export const openWarningModal = ({
	route,
	method,
	data,
	onConfirm,
	onCancel,
	onRes,
}: {
	route: string;
	method?: string;
	data?: object;
	onConfirm?: () => void;
	onCancel?: () => void;
	onRes?: (res: Response) => void;
}) =>
	openConfirmModal({
		title: 'Are you sure about this?',
		children: <Text>Are you sure you want to perform this action? It may cause damage!</Text>,
		cancelProps: {
			children: "Don't do it! 🥺",
		},
		confirmProps: {
			children: 'Do it! 😈',
		},
		onCancel,
		onConfirm: () => {
			fetch(route, { method, body: data ? JSON.stringify(data) : undefined }).then(onRes);
			onConfirm?.();
		},
	});
