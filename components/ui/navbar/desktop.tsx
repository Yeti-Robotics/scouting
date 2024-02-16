'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import BrandHeader from './brand-header';
import { UrlGroupI } from '.';

function DesktopNavURL({ href, text }: { href: string; text: string }) {
	return (
		<Link href={href} passHref legacyBehavior>
			<NavigationMenuLink className={navigationMenuTriggerStyle()}>{text}</NavigationMenuLink>
		</Link>
	);
}

function DesktopNavGroup({ group, isAdmin }: { group: UrlGroupI; isAdmin: boolean | undefined }) {
	return group.adminOnly && !isAdmin ? null : (
		<NavigationMenuItem>
			<NavigationMenuTrigger>{group.name}</NavigationMenuTrigger>
			<NavigationMenuContent>
				<div className='grid w-[450px] grid-cols-2 gap-3 p-4'>
					<div className=' relative flex h-48 w-full flex-col justify-end rounded-md bg-gradient-to-br from-primary/50 to-primary p-3'>
						<div className='mb-1 flex flex-wrap space-y-1 text-white'>
							<h4 className='typography w-full '>{group.name}</h4>
							{group.desc && <p className='small'>{group.desc}</p>}
						</div>
					</div>
					<ul className=''>
						{group.urls.map((url, j) =>
							url.adminOnly && !isAdmin ? null : (
								<li key={j}>
									<DesktopNavURL href={url.href} text={url.text} />
								</li>
							),
						)}
					</ul>
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
}

function DesktopNavGroupList({
	id,
	urlGroups,
	isAdmin,
}: {
	id: string | undefined;
	urlGroups: UrlGroupI[];
	isAdmin: boolean | undefined;
}) {
	return (
		<NavigationMenuList>
			{urlGroups.map((group, i) => (
				<DesktopNavGroup key={i} group={group} isAdmin={isAdmin} />
			))}
			<NavigationMenuItem key='auth'>
				<Link href={id ? '/logout' : '/login'} passHref legacyBehavior>
					<NavigationMenuLink
						href={id ? '/logout' : '/login'}
						className={navigationMenuTriggerStyle()}
					>
						{id ? 'Logout' : 'Login'}
					</NavigationMenuLink>
				</Link>
			</NavigationMenuItem>
		</NavigationMenuList>
	);
}

/**
 * Renders the desktop navigation bar.
 * @param props - The component props.
 * @param props.urlGroups - The array of URL groups.
 * @param props.isAdmin - Indicates if the user is an admin.
 * @returns The rendered desktop navigation bar.
 */
export function DesktopNav({
	urlGroups,
	isAdmin,
	id,
}: {
	urlGroups: UrlGroupI[];
	isAdmin: boolean | undefined;
	id: string | undefined;
}) {
	return (
		<div className='fixed top-0 z-40 flex h-12 w-full items-center border-b bg-background px-3'>
			<div className='grow'>
				<BrandHeader />
			</div>
			<div className='flex w-[450px] justify-end'>
				<NavigationMenu className='w-[450px]'>
					<DesktopNavGroupList id={id} urlGroups={urlGroups} isAdmin={isAdmin} />
				</NavigationMenu>
			</div>
		</div>
	);
}
