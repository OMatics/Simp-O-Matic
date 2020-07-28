//! Extending the corpus is done simply by:
//! ```ts
//! const markov = new Markov("Hello,");
//! markov.corpus += " World!";
//! ```


class Markov {
	corpus: string;
	constructor(corpus: string) {
		this.corpus = corpus;
	}

	get words() {
		return this.corpus.split(/\b/).filter(word => word != '');
	}

	get unique() {
		return new Set(this.words);
	}

	get dictionary_index() {
		const dict: { [key: string]: number } = {};
		let i: number = 0;
		for (const word of this.unique) {
			dict[word] = i;
			i += 1;
		}

		return dict;
	}
}

