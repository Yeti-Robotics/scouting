type Props = {
	width?: number | string;
	height?: number | string;
};

export const Amp = ({ width = 48, height = 48 }: Props) => (
	<svg width={width} height={height} viewBox='0 0 20 20'>
		<polygon
			points='2,1 2,19 18,19, 18,1'
			style={{ fill: 'rgb(0,0,255)', strokeWidth: 0.5, stroke: 'rgb(0,0,0)' }}
		/>
		<polygon
			points='5,4 5,10 15,10, 15,4'
			style={{ fill: 'rgb(0,0,0)', strokeWidth: 1, stroke: 'rgb(0,0,0)' }}
		/>
	</svg>
);

export const MissedNote = ({ width = 48, height = 48 }: Props) => (
	<svg width={width} height={height} viewBox='0 0 20 20'>
		<defs>
			<mask id='bigmask'>
				<rect width='100%' height='100%' fill='white' />
				<circle cx='10' cy='10' r='6' />
			</mask>
		</defs>
		<circle id='donut' cx='10' cy='10' r='8' mask='url(#bigmask)' fill='rgb(255,103,0)' />
		<polygon
			points='19,19 17,19 1,3 1,1 3,1 19,17'
			style={{ fill: 'rgb(250,0,0)', strokeWidth: 0.5, stroke: 'rgb(0,0,0)' }}
		/>
	</svg>
);
