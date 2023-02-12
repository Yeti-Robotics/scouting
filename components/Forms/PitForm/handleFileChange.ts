import { Reader } from '@/lib/Reader';
import { FileWithPath } from '@mantine/dropzone';
import { ChangeEvent, RefObject } from 'react';

export const handleFileChange =
	(
		i: number,
		imageRef: RefObject<HTMLImageElement>,
		files: FileWithPath[],
		setImage: (index: number, imageFile: File | undefined) => Promise<void>,
	) =>
	async (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target;
		if (!imageRef.current) return;
		const img = imageRef.current;
		if (!input.files || !input.files[0]) {
			await setImage(i, undefined);
			img.src = '';
			return;
		}
		const imageFile = input.files[0];
		const reader = new Reader();
		img.src = await reader.readAsDataURL(imageFile);
		img.width = 300;
		await setImage(i, imageFile);
	};
