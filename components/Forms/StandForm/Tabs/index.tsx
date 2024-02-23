'use client';

import Auto from '@/components/Forms/StandForm/Tabs/auto';
import Endgame from '@/components/Forms/StandForm/Tabs/endgame';
import Misc from '@/components/Forms/StandForm/Tabs/misc';
import Teleop from '@/components/Forms/StandForm/Tabs/teleop';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const tabs = [
	{ value: 'auto', label: 'Auto', content: <Auto /> },
	{ value: 'teleop', label: 'Teleop', content: <Teleop /> },
	{ value: 'endgame', label: 'Endgame', content: <Endgame /> },
	{ value: 'misc', label: 'Misc.', content: <Misc /> },
];

export default function FormTabs() {
	const [activeTab, setActiveTab] = useState('auto');

	return (
		<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className='w-full'>
			<TabsList className='grid w-full grid-cols-4'>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			<Card className='container mt-2 w-full px-2 py-4'>
				{tabs.map((tab) => (
					<TabsContent
						key={tab.value}
						value={tab.value}
						forceMount
						hidden={activeTab !== tab.value}
					>
						{tab.content}
					</TabsContent>
				))}
			</Card>
		</Tabs>
	);
}
