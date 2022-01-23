export default class CallableClass extends Function {
	protected _bound;
	protected _;
	constructor() {
		super('...args', 'return this._bound._call(...args)');

		this._ = this.bind(this);
		this._bound = this._;
	}

	protected async _call(...args: any[]) {
		return console.log('called with: ', [...args]);
	}
}
