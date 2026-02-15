interface PolyominoColor {
	[key: string]: string;
}

class Configuration {
	colors: PolyominoColor = $state({});
	id = 0;

	setColors(colors: string[]) {
		this.id = 0;
		this.colors = {
			0: '#f9eee5',
			X: '#949baa'
		};

		for (const color of colors) {
			this.colors[++this.id] = color;
		}
	}

	addColor(color: string) {
		this.colors[++this.id] = color;
	}
}

export const polyominoConfig = new Configuration();
