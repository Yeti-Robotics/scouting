import { Reader } from '@/lib/Reader';
import { PitImageI } from '@/models/PitImage';
import { Button, Group, Image, rem, Stack, Text, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { handleFileChange } from './handleFileChange';

type Props = {
	image: Partial<
		PitImageI & {
			listId: number;
		}
	>;
	i: number;
	setImage: (index: number, imageFile: File | undefined) => Promise<void>;
	removeImage: (index: number) => void;
};

const ImageCard = ({ image, setImage, i, removeImage }: Props) => {
	const imageRef = useRef<HTMLImageElement>(null);
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
		<Stack align='center'>
			<Image
				style={{ display: imageRef.current?.src ? 'block' : 'none', alignSelf: 'center' }}
				imageRef={imageRef}
				maw={300}
				alt='Pit Image'
			/>
			{!image._id && (
				<>
					<Dropzone
						onDrop={(files) => handleFileChange(i, imageRef, files, setImage)}
						onReject={(files) => console.log('rejected files', files)}
						maxSize={3 * 1024 ** 2}
						accept={['image/png', 'image/jpg', 'image/jpeg']}
						maw={300}
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

					<Button color='red' onClick={() => removeImage(i)}>
						Delete
					</Button>
				</>
			)}
		</Stack>
	);
};

export default ImageCard;
