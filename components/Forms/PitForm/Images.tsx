import { Box, Button, TextField } from '@mui/material';

interface Props {
	state: [Buffer[], React.Dispatch<React.SetStateAction<Buffer[]>>];
}

const Images: React.VFC<Props> = ({ state }) => {
	const [images, setImages] = state;

	const addImage = () => {
		const newImages = [...images];
		newImages.unshift(Buffer.from([]));
		setImages(newImages);
	};

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{images.map((image, i) => (
					<Box key={i}>
						<TextField type='file' />
					</Box>
				))}
				<Button variant='contained' onClick={addImage}>
					Add Image
				</Button>
			</Box>
		</>
	);
};

export default Images;
