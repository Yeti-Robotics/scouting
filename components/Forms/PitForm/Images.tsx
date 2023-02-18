import { PitImageI } from '@/models/PitImage';
import { Button, Group, Stack } from '@mantine/core';
import ImageCard from './ImageCard';

interface Props {
	state: [
		Partial<PitImageI & { listId: number }>[],
		React.Dispatch<React.SetStateAction<Partial<PitImageI & { listId: number }>[]>>,
	];
	canEdit?: boolean;
}

let id = 0;

const Images = ({ state, canEdit }: Props) => {
	const [images, setImages] = state;

	const addImage = () => {
		id++;
		const newImages = [...images];
		newImages.push({ listId: id });
		setImages(newImages);
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const setImage = async (index: number, imageFile: File | undefined) => {
		const newImages = [...images];

		if (!imageFile) {
			newImages[index].data = undefined;
			return setImages(newImages);
		}

		const data = Buffer.from(await imageFile.arrayBuffer());
		newImages[index].data = data;
		setImages(newImages);
	};

	return (
		<>
			<Stack>
				{images.map((image, i) => (
					<ImageCard
						key={image._id || image.listId || Date.now()}
						image={image}
						i={i}
						removeImage={removeImage}
						setImage={setImage}
					/>
				))}
				<Group position='center'>
					<Button mt='md' disabled={!canEdit} onClick={addImage}>
						Add Image
					</Button>
				</Group>
			</Stack>
		</>
	);
};

export default Images;
