export default class CallableClass extends Function {
	protected _bound;
	constructor() {
		super('...args', 'return this._bound._call(...args)');

		const _ = this.bind(this);
		this._bound = _;
		return _;
	}

	protected async _call(...args: any[]) {
		return console.log('called with: ', [...args]);
	}
}
