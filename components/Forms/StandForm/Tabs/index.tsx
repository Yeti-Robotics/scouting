'use client';

import Auto from '@/components/Forms/StandForm/Tabs/auto';
import Endgame from '@/components/Forms/StandForm/Tabs/endgame';
import Misc from '@/components/Forms/StandForm/Tabs/misc';
import Teleop from '@/components/Forms/StandForm/Tabs/teleop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { createContext } from 'react';
import { onSubmit } from '../onSubmit';

const defaultFormValues = {
	auto: {
		ampNotes: 0,
		speakerNotes: 0,
		notesMissed: 0,
	},
	teleop: {
		ampNotes: 0,
		speakerNotes: 0,
		amplifiedSpeakerNotes: 0,
		notesMissed: 0,
	},
	endgame: {
		trapNotesAttempted: 0,
		trapNotes: 0,
	},
	misc: {
		penalties: 0,
	},
};

export interface FormContextI {
	values: typeof defaultFormValues;
	setValues?: Dispatch<SetStateAction<typeof defaultFormValues>>;
}

export type ValueKeysT = keyof typeof defaultFormValues;

export const FormContext = createContext<FormContextI>({ values: defaultFormValues });

export default function Scouting() {
	const [tab, setTab] = useState('auto');
	const [values, setValues] = useState(defaultFormValues);

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(values);
	}

	return (
		<main className='mx-auto flex w-full max-w-[360px] flex-wrap items-center justify-center py-8'>
			<h1 className='typography mb-6 w-full'>Stand Form</h1>
			<form className='w-full' onSubmit={handleSubmit}>
				<FormContext.Provider value={{ values, setValues }}>
					<div className='grid grid-cols-2 gap-4 pb-4'>
						<div>
							<Label htmlFor='matchNumber' className='ml-1'>
								Match Number
							</Label>
							<Input
								name='matchNumber'
								className='w-full'
								placeholder='Match Number'
								value={values.matchNumber}
							/>
						</div>
						<div>
							<Label htmlFor='teamNumber' className='ml-1'>
								Team Number
							</Label>
							<Input
								name='teamNumber'
								className='w-full'
								placeholder='Team Number'
								value={values.teamNumber}
							/>
						</div>
					</div>
					<Tabs value={tab} onValueChange={(v) => setTab(v)} className='w-full'>
						<TabsList className='grid w-full grid-cols-4'>
							<TabsTrigger value='auto'>Auto</TabsTrigger>
							<TabsTrigger value='teleop'>Teleop</TabsTrigger>
							<TabsTrigger value='endgame'>Endgame</TabsTrigger>
							<TabsTrigger value='misc'>Misc.</TabsTrigger>
						</TabsList>
						<TabsContent value='auto'>
							<Auto />
						</TabsContent>
						<TabsContent value='teleop'>
							<Teleop />
						</TabsContent>
						<TabsContent value='endgame'>
							<Endgame />
						</TabsContent>
						<TabsContent value='misc'>
							<Misc />
						</TabsContent>
					</Tabs>
				</FormContext.Provider>
				<Button type='submit' className='my-2 w-full'>
					Submit
				</Button>
			</form>
		</main>
	);
}
