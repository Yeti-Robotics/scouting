import { CreateStandForm } from '@/models/StandForm';

export const defaultValues: Partial<CreateStandForm> = {
	autoTopCones: 0,
	autoMidCones: 0,
	autoLowCones: 0,
	autoTopCubes: 0,
	autoMidCubes: 0,
	autoLowCubes: 0,
	teleopTopCones: 0,
	teleopMidCones: 0,
	teleopLowCones: 0,
	teleopTopCubes: 0,
	teleopMidCubes: 0,
	teleopLowCubes: 0,
	links: 0,
	penalties: 0,
	numberOnCharger: 0,
	attemptedAutoBalance: false,
	autoDocked: false,
	autoEngaged: false,
	teleopDocked: false,
	teleopEngaged: false,
};
