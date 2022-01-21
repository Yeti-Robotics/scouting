export class Reader {
	private fileReader;
	constructor() {
		this.fileReader = new FileReader();
	}

	createDataURL(file: Blob): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			try {
				this.fileReader.onload = () => {
					resolve(this.fileReader.result as string);
				};

				this.fileReader.readAsDataURL(file);
			} catch (err: unknown) {
				reject(err);
			}
		});
	}
}
