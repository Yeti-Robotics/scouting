import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
	expanded?: boolean;
	title: string;
}

const Section: React.FC<Props> = ({ title, expanded = true, children }) => {
	const [isExpanded, setIsExpanded] = useState(expanded);

	useEffect(() => setIsExpanded(expanded), [expanded]);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				border: '0.25rem solid #fff',
				borderColor: 'primary.main',
				borderRadius: '8px',
				width: '95%',
				m: 2,
				borderSpacing: 0,
				position: 'relative',
			}}
		>
			<Box
				sx={{
					width: '100%',
					fontSize: '2.5rem',
					height: 'auto',
					fontWeight: 'bold',
					backgroundColor: 'primary.main',
					padding: 1,
					alignSelf: 'flex-start',
					border: '1px solid #fff',
					borderColor: 'primary.main',
				}}
			>
				{title}
				<Button onClick={() => setIsExpanded((prev) => !prev)}>
					<ArrowDropDown
						style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
						sx={{
							color: 'text.primary',
							fontSize: 48,
							transition: 'transform 0.15s ease',
						}}
					/>
				</Button>
			</Box>
			<Box
				sx={{
					display: 'flex',
					height: 'auto',
					width: '100%',
					flexDirection: 'column',
					alignItems: 'center',
					border: 0,
					padding: 1,
					flexGrow: 1,
				}}
				style={{
					height: isExpanded ? undefined : 0,
					padding: isExpanded ? undefined : 0,
					overflow: isExpanded ? undefined : 'hidden',
				}}
			>
				{children}
			</Box>
		</Box>
	);
};

export default Section;
