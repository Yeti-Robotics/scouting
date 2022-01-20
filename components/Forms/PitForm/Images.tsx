import { PitImageI } from '@/models/PitImage';
import { Box, Button, TextField } from '@mui/material';

interface Props {
	state: [Partial<PitImageI>[], React.Dispatch<React.SetStateAction<Partial<PitImageI>[]>>];
}

let id = 0;

const Images: React.VFC<Props> = ({ state }) => {
	const [images, setImages] = state;

	const addImage = () => {
		id++;
		const newImages = [...images];
		newImages.push({});
		setImages(newImages);
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{images.map((image, i) => (
					<Box key={image._id || id}>
						<TextField type='file' />
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
				))}
				<Box display='flex' justifyContent='center'>
					<Button variant='contained' onClick={addImage}>
						Add Image
					</Button>
				</Box>
			</Box>
		</>
	);
};

export default Images;
