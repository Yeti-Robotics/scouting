import { PitFormI } from '@/models/PitForm';
import { PitImageI } from '@/models/PitImage';
import { StandFormI } from '@/models/StandForm';
import { UserI } from '@/models/User';
import { SubmitHandler } from 'react-hook-form';

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: (
	create: boolean,
	user: UserI,
	images: Partial<PitImageI & { listId: number }>[],
) => SubmitHandler<StandFormI> = (create, user, images) => {
	const onCreate: SubmitHandler<StandFormI> = async (data, e) => {
		console.log(data);
		const formDataRes = await fetch('/api/forms/pit', {
			method: 'POST',
			body: JSON.stringify({ ...data, scouter: user.username }),
		});
		if (!formDataRes.ok) return;
		const formData: PitFormI = await formDataRes.json();
		// only submit new images with data properties
		const filteredImages = images.filter((image) => !image._id && image.data) as {
			data: Buffer;
		}[];
		const uploadedImages = new FormData();
		filteredImages.forEach((image, i) => {
			uploadedImages.append(`file${i}`, new Blob([image.data]));
		});
		const imagesRes = await fetch(`/api/forms/pit-image?formId=${formData._id}`, {
			method: 'POST',
			body: uploadedImages,
		});
	};

	const onUpdate: SubmitHandler<StandFormI> = async (data, e) => {
		console.log(data);
	};

	return create ? onCreate : onUpdate;
};
