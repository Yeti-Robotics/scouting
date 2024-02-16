import Link from 'next/link';
import Image from 'next/image';

export default function BrandHeader() {
	return (
		<Link href='/'>
			<div className='flex items-center space-x-2'>
				<Image alt='Yeti Robotics logo' src='/yeti-logo.png' height={32} width={32} />
				<h3 className='typography'>YETI Scouting</h3>
			</div>
		</Link>
	);
}
