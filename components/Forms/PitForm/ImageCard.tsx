import { Reader } from '@/lib/Reader';
import { PitImageI } from '@/models/PitImage';
import { Box, TextField, Button } from '@mui/material';
import { useEffect, useRef } from 'react';
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

	useEffect(() => {
		if (!imageRef.current) return;
		if (image.data) {
			new Reader().readAsDataURL(new Blob([image.data])).then((dataUrl) => {
				if (!imageRef.current) return;
				imageRef.current.src = dataUrl;
				imageRef.current.width = 300;
			});
		}
	}, []);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<img style={{ alignSelf: 'center' }} ref={imageRef} alt='Pit Image' />
			{!image._id && (
				<>
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
				</>
			)}
		</Box>
	);
};

export default ImageCard;
