import { Reader } from '@/lib/Reader';
import { PitImageI } from '@/models/PitImage';
import { Box, Button, Group, Image, rem, Text, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
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
	const theme = useMantineTheme();

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
			<Image style={{ alignSelf: 'center' }} ref={imageRef} alt='Pit Image' />
			{!image._id && (
				<>
					<Dropzone
						onDrop={(files) => console.log('accepted files', files)}
						onReject={(files) => console.log('rejected files', files)}
						maxSize={3 * 1024 ** 2}
						accept={['image/png', 'image/jpg', 'image/jpeg']}
						ref={inputRef}
					>
						<Group
							position='center'
							spacing='xl'
							style={{ minHeight: rem(220), pointerEvents: 'none' }}
						>
							<Dropzone.Accept>
								<IconUpload
									size='3.2rem'
									stroke={1.5}
									color={
										theme.colors[theme.primaryColor][
											theme.colorScheme === 'dark' ? 4 : 6
										]
									}
								/>
							</Dropzone.Accept>
							<Dropzone.Reject>
								<IconX
									size='3.2rem'
									stroke={1.5}
									color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
								/>
							</Dropzone.Reject>
							<Dropzone.Idle>
								<IconPhoto size='3.2rem' stroke={1.5} />
							</Dropzone.Idle>

							<div>
								<Text size='xl' inline>
									Drag images here or click to select files
								</Text>
								<Text size='sm' color='dimmed' inline mt={7}>
									Attach as many files as you like, each file should not exceed
									5mb
								</Text>
							</div>
						</Group>
					</Dropzone>

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
