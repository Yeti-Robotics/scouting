import StandForm from '@/components/Forms/StandForm';

export default function StandFormPage() {
	return (
		<main className='mx-auto flex w-full max-w-[360px] flex-wrap items-center justify-center py-8'>
			<h1 className='typography mb-6 w-full'>Stand Form</h1>
			<StandForm create canEdit />
		</main>
	);
}
