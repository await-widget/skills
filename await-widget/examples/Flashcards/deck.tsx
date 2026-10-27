export type Card = {
	front: string;
	back: string;
};

export type Deck = {
	name: string;
	cards: Card[];
};

function isLineBreak(character: string): boolean {
	return character === '\r' || character === '\n';
}

export function parseDeck(source: string, path: string): Deck {
	const text = source.replace(/^\u{FEFF}/u, '');
	const csv = path.toLowerCase().endsWith('.csv');
	const separator = csv ? ',' : '\t';
	const cards: Card[] = [];
	let columns: string[] = [];
	let field = '';
	let quoted = false;
	let recordStart = true;

	const finishRecord = () => {
		columns.push(field);
		cards.push({front: columns[0], back: columns[1]});
		columns = [];
		field = '';
		recordStart = true;
	};

	for (let index = 0; index < text.length; index++) {
		const character = text[index];
		if (quoted) {
			if (character === '"') {
				if (text[index + 1] === '"') {
					field += '"';
					index++;
				} else {
					quoted = false;
				}
			} else {
				field += character;
			}

			continue;
		}

		if (!csv && recordStart && character === '#') {
			const header = /^#(?:separator:tab|html:(?:false|true))(?=\r|\n|$)/u.exec(text.slice(index));
			if (header) {
				index += header[0].length - 1;
				continue;
			}
		}

		if (isLineBreak(character)) {
			if (!recordStart) {
				finishRecord();
			}

			if (character === '\r' && text[index + 1] === '\n') {
				index++;
			}

			continue;
		}

		recordStart = false;
		if (character === separator) {
			columns.push(field);
			field = '';
		} else if (character === '"' && field === '') {
			quoted = true;
		} else {
			field += character;
		}
	}

	if (!recordStart) {
		finishRecord();
	}

	return {name: path, cards};
}
