// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameData } from "./jsonData"

const { ccclass, property } = cc._decorator

@ccclass
export default abstract class MinigameManager extends cc.Component {
	@property(cc.Prefab)
	abstract answerPrefab: cc.Prefab
	@property(cc.Prefab)
	abstract questionPrefab: cc.Prefab
	abstract arrAnswer: any[]
	abstract arrQuestion: any[]

	protected abstract _gameId: string
	private _data: GameData = null
	metadata: any = null

	public get data(): any {
		return this._data
	}
	private set data(value: any) {
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

	public abstract get getScore(): boolean

	public clean /* Don dep tan du */() {}

	/** Xuat du lieu ra de gui */
	public exportData() {
		const pageData: any = {}
		pageData.IdItem = this.data.IdItem
		pageData.Title = this.data.Title
		pageData.question = []
		this.arrQuestion.forEach((ques) => {
			pageData.question.push(ques.exportData())
		})
		pageData.answer = []
		this.arrAnswer.forEach((ans) => {
			pageData.answer.push(ans.exportData())
		})
		return pageData
	}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		this.data = JSON.parse(this.jsonData)
	}

	start() {}

	// update (dt) {}
}
