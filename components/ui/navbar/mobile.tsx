import BrandHeader from './brand-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconMenu2 } from '@tabler/icons-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { UrlGroupI } from '.';

/**
 * Renders a mobile navigation URL.
 * @param props - The component props.
 * @param props.href - The URL to navigate to.
 * @param props.text - The text to display for the URL.
 * @returns The rendered mobile navigation URL component.
 */
function MobileNavURL({ href, text }: { href: string; text: string }) {
	return (
		<li className='w-full'>
			<Link href={href} className=' text-base'>
				{text}
			</Link>
		</li>
	);
}

/**
 * Responsible for rendering a URL group in the mobile nav
 * @param props.group - the group of urls to render
 * @param props.isAdmin - whether the user is an admin or not
 * @returns a component that renders the group of urls
 */
function MobileNavGroup({ group, isAdmin }: { group: UrlGroupI; isAdmin: boolean | undefined }) {
	return group.adminOnly && !isAdmin ? null : (
		<li key={group.name} className='w-full'>
			<h4 className='typography text-foreground'>{group.name}</h4>
			<ul className='my-4 ml-2 flex flex-wrap space-y-4'>
				{group.urls.map((url, j) =>
					url.adminOnly && !isAdmin ? null : (
						<MobileNavURL key={j} href={url.href} text={url.text} />
					),
				)}
			</ul>
		</li>
	);
}

/**
 * Renders a list of mobile navigation groups.
 *
 * @param props - The component props.
 * @param props.urlGroups - The array of URL groups.
 * @param props.isAdmin - Indicates if the user is an admin.
 * @returns The rendered mobile navigation groups.
 */
function MobileNavGroups({
	urlGroups,
	isAdmin,
}: {
	urlGroups: UrlGroupI[];
	isAdmin: boolean | undefined;
}) {
	return (
		<ul className='ml-10 flex flex-wrap space-y-2 pt-4 text-left text-muted-foreground'>
			{urlGroups.map((group, i) => (
				<MobileNavGroup key={i} group={group} isAdmin={isAdmin} />
			))}
		</ul>
	);
}

function TopBar({ id }: { id: string | undefined }) {
	return (
		<div className='fixed top-0 z-40 flex h-12 w-full items-center border-b bg-background px-3'>
			<div className='grow'>
				<SheetTrigger asChild>
					<IconMenu2 className='h-8 w-8' />
				</SheetTrigger>
			</div>
			<Link href={id ? '/logout' : '/login'}>
				<Button variant='ghost'>{id ? 'Logout' : 'Login'}</Button>
			</Link>
		</div>
	);
}

/**
 * Renders the mobile navigation.
 *
 * @param props - The component props.
 * @param props.id - The user's ID.
 * @param props.isAdmin - Indicates if the user is an admin.
 * @param props.urlGroups - The array of URL groups.
 * @returns The rendered mobile navigation.
 */
export default function MobileNav({
	id,
	isAdmin,
	urlGroups,
}: {
	id: string | undefined;
	isAdmin: boolean | undefined;
	urlGroups: UrlGroupI[];
}) {
	return (
		<Sheet>
			<TopBar id={id} />
			<SheetContent side='left' className='md:hidden' overlayClassName='md:hidden'>
				<SheetHeader>
					<SheetTitle>
						<BrandHeader />
					</SheetTitle>
					<MobileNavGroups urlGroups={urlGroups} isAdmin={isAdmin} />
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
