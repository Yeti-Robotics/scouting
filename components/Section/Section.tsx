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
				width: '95%',
				m: 2,
				borderSpacing: 0,
				position: 'relative',
			}}
		>
			<Box
				sx={{
					width: '100%',
					fontSize: '1.75rem',
					height: 'auto',
					fontWeight: 'bold',
					backgroundColor: 'primary.main',
					padding: 1,
					alignSelf: 'flex-start',
					border: '1px solid #fff',
					borderColor: 'primary.main',
					borderTopLeftRadius: '8px',
					borderTopRightRadius: '8px',
					borderBottom: '0px',
					borderBottomLeftRadius: isExpanded ? undefined : '8px',
					borderBottomRightRadius: isExpanded ? undefined : '8px',
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
					padding: 2,
					flexGrow: 1,
					border: '1px solid #fff',
					borderTop: '0px',
					borderBottom: isExpanded ? undefined : '0px',
					borderColor: 'primary.main',
					borderBottomLeftRadius: '8px',
					borderBottomRightRadius: '8px',
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
