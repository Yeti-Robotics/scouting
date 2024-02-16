import { DesktopNav } from './desktop';
import MobileNav from './mobile';

interface UrlI {
	href: string;
	text: string;
	adminOnly?: boolean;
}

export interface UrlGroupI {
	name: string;
	desc?: string;
	urls: UrlI[];
	adminOnly?: boolean;
}

export default function Navbar({
	id,
	isAdmin,
}: {
	id: string | undefined;
	isAdmin: boolean | undefined;
}) {
	const urlGroups: UrlGroupI[] = [
		{
			name: 'Scouting',
			desc: 'Links to scouting data forms and schedules.',
			urls: [
				{ href: '/stand-scouting', text: 'Stand Form' },
				{ href: '/scouting-schedule', text: 'Stand Schedule' },
				{ href: '/pit-scouting', text: 'Pit Form' },
			],
		},
		{
			name: 'Data & Analysis',
			desc: 'Links to data analysis pages.',
			urls: [
				{ href: '/matches', text: 'Matches' },
				{ href: '/teams', text: 'Teams' },
				{ href: '/records', text: 'Records' },
				{ href: '/export', text: 'Export' },
			],
		},
		{
			name: 'Admin',
			desc: 'Links to admin pages.',
			urls: [
				{ href: '/picklist', text: 'Picklist' },
				{ href: '/spr', text: 'SPR' },
			],
			adminOnly: true,
		},
	];

	return (
		<nav>
			<div className='md:hidden'>
				<MobileNav id={id} isAdmin={isAdmin} urlGroups={urlGroups} />
			</div>
			<div className='hidden md:block'>
				<DesktopNav id={id} isAdmin={isAdmin} urlGroups={urlGroups} />
			</div>
		</nav>
	);
}
