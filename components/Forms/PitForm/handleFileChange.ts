import { Reader } from '@/lib/Reader';
import { FileWithPath } from '@mantine/dropzone';
import { RefObject } from 'react';

export const handleFileChange = async (
	imageIndex: number,
	imageRef: RefObject<HTMLImageElement>,
	files: FileWithPath[],
	setImage: (index: number, imageFile: File | undefined) => Promise<void>,
) => {
	const img = imageRef.current;
	if (!img) return;
	const reader = new Reader();
	for (let i = 0; i < files.length; i++) {
		const imageFile = files[i];
		if (!imageFile) continue;
		img.src = await reader.readAsDataURL(imageFile);
		img.width = 300;
		await setImage(imageIndex, imageFile);
	}
};
