import {
	Modifier,
} from 'await';

export type Sound = {
	path: string;
	name: string;
	velocity: number;
	isChord: boolean;
};

export type Notes = {
	whiteNotes: Array<number | undefined>;
	blackNotes: Array<number | undefined>;
};

export type Data = {
	blackKeyWidth: number;
	blackKeysWidth: number;
	blackKeyHeight: number;
	shift: number;
	whiteKeysWidth: number;
	sound: Sound;
} & Notes;

/* eslint-disable @stylistic/array-element-newline */
export const allWhiteNotes = [
	undefined,
	21, 23,
	24, 26, 28, 29, 31, 33, 35,
	36, 38, 40, 41, 43, 45, 47,
	48, 50, 52, 53, 55, 57, 59,
	60, 62, 64, 65, 67, 69, 71,
	72, 74, 76, 77, 79, 81, 83,
	84, 86, 88, 89, 91, 93, 95,
	96, 98, 100, 101, 103, 105, 107,
	108,
	undefined,
];

export const allBlackNotes = [
	undefined,
	undefined, 22,
	undefined, 25, 27, undefined, 30, 32, 34,
	undefined, 37, 39, undefined, 42, 44, 46,
	undefined, 49, 51, undefined, 54, 56, 58,
	undefined, 61, 63, undefined, 66, 68, 70,
	undefined, 73, 75, undefined, 78, 80, 82,
	undefined, 85, 87, undefined, 90, 92, 94,
	undefined, 97, 99, undefined, 102, 104, 106,
	undefined,
	undefined,
	undefined,
];
// Uses the same index as the white key and represents the black key on its left. Since there is one extra black-key position, the array has an extra element at the end.

/* eslint-enable @stylistic/array-element-newline */

export const defaultIndex = 23;
export const topHeight = 40;

export const whiteKeyStyle: CustomButtonStyle = {
	press: <Modifier
		colorMultiply={0.8}
		animation={{type: 'easeInOut', duration: 0}}
	/>,
	normal: <Modifier
		colorMultiply={1}
		animation={{type: 'easeInOut', duration: 0.3}}
	/>,
};

export const blackKeyStyle: CustomButtonStyle = {
	press: <Modifier
		colorMultiply={0.6}
		animation={{type: 'easeInOut', duration: 0}}
	/>,
	normal: <Modifier
		colorMultiply={1}
		animation={{type: 'easeInOut', duration: 0.3}}
	/>,
};

export const chords: Record<number, number[] | undefined> = {
	0: [0, 4, 7], // C
	2: [0, 3, 7], // D
	4: [0, 3, 7], // E
	5: [0, 4, 7], // F
	7: [0, 4, 7], // G
	9: [0, 3, 7], // A
};

export const sounds: Sound[] = [
	{
		path: '/assets/sounds/Gran.sf2', velocity: 127, name: 'GRAN', isChord: false,
	},
	{
		path: '/assets/sounds/Gran.sf2', velocity: 127, name: 'GRAN CH', isChord: true,
	},
	{
		path: '/assets/sounds/Elec.sf2', velocity: 64, name: 'ELEC', isChord: false,
	},
	{
		path: '/assets/sounds/Elec.sf2', velocity: 64, name: 'ELEC CH', isChord: true,
	},
];