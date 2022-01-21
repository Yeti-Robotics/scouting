import { PitImageI } from '@/models/PitImage';
import { Box, TextField, Button } from '@mui/material';
import { useRef } from 'react';
import { handleFileChange } from './handleFileChange';

interface Props {
	image: Partial<
		PitImageI & {
			listId: number;
		}
	>;
	i: number;
	setImage: (index: number, imageFile: File | undefined) => Promise<void>;
	removeImage: (index: number) => void;
}

const ImageCard: React.VFC<Props> = ({ image, setImage, i, removeImage }) => {
	const imageRef = useRef<HTMLImageElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<img style={{ alignSelf: 'center' }} ref={imageRef} alt='Pit Image' />
			<TextField
				type='file'
				ref={inputRef}
				disabled={Boolean(image._id)}
				onChange={handleFileChange(i, imageRef, inputRef, setImage)}
				inputProps={{ accept: '.png,.jpg,.jpeg' }}
			/>
			<Button
				variant='contained'
				sx={{
					backgroundColor: 'error.main',
					'&:hover': { backgroundColor: 'error.dark' },
				}}
				onClick={() => removeImage(i)}
			>
				Delete
			</Button>
		</Box>
	);
};

export default ImageCard;
