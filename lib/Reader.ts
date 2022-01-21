export class Reader {
	private fileReader;

	// ready states
	public readonly EMPTY = 0;
	public readonly LOADING = 1;
	public readonly DONE = 2;

	constructor() {
		this.fileReader = new FileReader();
	}

	readAsDataURL(file: Blob): Promise<string> {
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

	readAsArrayBuffer(file: Blob): Promise<ArrayBuffer> {
		return new Promise<ArrayBuffer>((resolve, reject) => {
			try {
				this.fileReader.onload = () => {
					resolve(this.fileReader.result as ArrayBuffer);
				};

				this.fileReader.readAsArrayBuffer(file);
			} catch (err: unknown) {
				reject(err);
			}
		});
	}

	readAsBinaryString(file: Blob): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			try {
				this.fileReader.onload = () => {
					resolve(this.fileReader.result as string);
				};

				this.fileReader.readAsBinaryString(file);
			} catch (err: unknown) {
				reject(err);
			}
		});
	}

	readAsText(file: Blob, encoding?: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			try {
				this.fileReader.onload = () => {
					resolve(this.fileReader.result as string);
				};

				this.fileReader.readAsText(file, encoding);
			} catch (err: unknown) {
				reject(err);
			}
		});
	}

	getResult() {
		return this.fileReader.result;
	}

	getReadyState() {
		return this.fileReader.readyState;
	}

	getError() {
		return this.fileReader.error;
	}

	abort() {
		return this.fileReader.abort();
	}

	addEventListener<T extends keyof Omit<FileReaderEventMap, 'load'>>(
		type: T,
		callback: (ev: Omit<FileReaderEventMap, 'load'>[T]) => void,
		options?: boolean | AddEventListenerOptions,
	): void {
		if ((type as any) === 'load') return;
		this.fileReader.addEventListener(type, callback, options);
	}
}
