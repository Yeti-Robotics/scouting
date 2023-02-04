import { Box, BoxProps } from '@mantine/core';
import NextLink, { LinkProps } from 'next/link';

type Props = BoxProps & LinkProps;

export const Link = ({ children, ...props }: Props) => {
	return (
		<Box component={NextLink} {...props}>
			{children}
		</Box>
	);
};
