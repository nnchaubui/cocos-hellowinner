// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator

@ccclass
export default abstract class MinigameManager extends cc.Component {

	protected abstract _gameId: string
	private _metadata: any = null

	public get metadata(): any {
		return this._metadata
	}
	public set metadata(value: any) {
		this._metadata = value
	}

	private _data: any = null
	public get data(): any {
		return this._data
	}
	public set data(value: any) {
		this._data = value
	}

	public get description(): any {
		return this.metadata.description
	}

	public get status(): number {
		return this.metadata.status
	}

	public get createdDate(): string {
		return this.metadata.createdDate
	}

	public get updatedDate(): string {
		return this.metadata.updatedDate
	}

	public get itemGroupId(): string {
		return this.metadata.itemGroupId
	}

	public get jsonData(): string {
		return this.metadata.jsonData
	}

	public get properties(): any {
		return this.metadata.properties
	}

	public get gameId(): string {
		return this._gameId
	}

	public get id(): string {
		return this.metadata.id
	}

	public get getScore(): boolean {
		return false
	}

	public clean /* Don dep tan du */() {}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		this.data = JSON.parse(this.jsonData)
	}

	start() {}

	// update (dt) {}
}
