import { PitFormI } from '@/models/PitForm';
import { PitImageI } from '@/models/PitImage';
import { UserI } from '@/models/User';
import { notifications } from '@mantine/notifications';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, UseFormReset } from 'react-hook-form';

type PitFormOnSubmit = (
	create: boolean,
	user: UserI | undefined,
	reset: UseFormReset<PitFormI>,
	images: Partial<PitImageI & { listId: number }>[],
	setImages: React.Dispatch<React.SetStateAction<Partial<PitImageI & { listId: number }>[]>>,
	setSubmitting: Dispatch<SetStateAction<'done' | 'fetching' | ''>>,
) => SubmitHandler<PitFormI>;

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: PitFormOnSubmit = (
	create,
	user,
	reset,
	images,
	setImages,
	setSubmitting,
) => {
	const onCreate: SubmitHandler<PitFormI> = async (data) => {
		setSubmitting('fetching');
		// we need a user to create a form
		if (!user || user.banned) return;

		const formDataRes = await fetch('/api/forms/pit', {
			method: 'POST',
			body: JSON.stringify({ ...data, scouter: user.username }),
		});

		// Always setSubmitting (loading) to done even if the request failed
		setSubmitting('done');
		if (!formDataRes.ok) return;

		// Reset early and submit images in the background
		reset();
		setImages([]);
		const formData: PitFormI = await formDataRes.json();
		// only submit new images with data properties
		const filteredImages = images.filter((image) => !image._id && image.data) as {
			data: Buffer;
		}[];

		// only atempt img upload if there are any
		if (filteredImages?.length !== 0) {
			const uploadedImages = new FormData();
			filteredImages.forEach((image, i) => {
				uploadedImages.append(`file${i}`, new Blob([image.data]));
			});
			notifications.show({
				id: formData._id,
				title: 'Uploading images...',
				loading: true,
				autoClose: false,
				message: `Uploading ${filteredImages.length} images to the database.`,
				withCloseButton: true,
			});
			const imagesRes = await fetch(
				`/api/forms/pit-image?formId=${formData._id}&teamNumber=${formData.teamNumber}`,
				{
					method: 'POST',
					body: uploadedImages,
				},
			).finally(() => notifications.hide(formData._id));
			if (!imagesRes.ok) return;
		}
	};

	const onUpdate: SubmitHandler<PitFormI> = async (data) => {
		setSubmitting('fetching');
		// must be admin to update
		if (!user?.administrator || !user || user.banned) return;

		const formDataRes = await fetch('/api/forms/pit', {
			method: 'PATCH',
			body: JSON.stringify({ ...data, scouter: user.username }),
		});
		if (!formDataRes.ok) return;
		const formData: PitFormI = await formDataRes.json();
		// only submit new images with data properties
		const filteredImages = images.filter((image) => !image._id && image.data) as {
			data: Buffer;
		}[];

		// only try and upload images if there are any
		if (filteredImages[0]) {
			const uploadedImages = new FormData();
			filteredImages.forEach((image, i) => {
				uploadedImages.append(`file${i}`, new Blob([image.data]));
			});
			const imagesRes = await fetch(
				`/api/forms/pit-image?formId=${formData._id}&teamNumber=${formData.teamNumber}`,
				{
					method: 'POST',
					body: uploadedImages,
				},
			);
			if (!imagesRes.ok) return;
		}
		setSubmitting('done');
	};

	return create ? onCreate : onUpdate;
};
