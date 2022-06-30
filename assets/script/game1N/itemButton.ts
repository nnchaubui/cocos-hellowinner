// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game1NManager from "./game1NManager"

const { ccclass, property } = cc._decorator

@ccclass
export default abstract class ItemButton extends cc.Component {
	private _data: any = null
	public get data(): any {
		return this._data
	}
	public set data(value: any) {
		this._data = value
	}

	public get Id(): string {
		return this.data.Id
	}
	public get Image(): string {
		return this.data.Image
	}
	public get IsCorrect(): boolean {
		return this.data.IsCorrect
	}
	public get Json(): null {
		return this.data.Json
	}
	public get Sound(): string {
		return this.data.Sound
	}
	public get Spine(): null {
		return this.data.Spine
	}
	public get Text(): null {
		return this.data.Text
	}
	protected set Text(text: string)
	{
		this.data.Text = text
	}
	public get Solution(): number {
		return this.data.Solution
	}

	public get Index(): number {
		return this.data.Index
	}

	type: string = null
	manager: Game1NManager = null

	toggle: cc.Toggle
	frame: cc.SpriteFrame

	@property(cc.SpriteFrame)
	checkFrame: cc.SpriteFrame = null

	@property(cc.SpriteFrame)
	uncheckFrame: cc.SpriteFrame = null

	public abstract exportData(): any

	onLoad() {
		this.toggle = this.node.getComponent(cc.Toggle)
		this.loadData()
	}

	protected abstract loadData(): void

	protected update(dt: number): void {
		if (this.toggle.isChecked) {
			this.node.getComponentInChildren(cc.Sprite).spriteFrame = this.checkFrame
		} else {
			this.node.getComponentInChildren(cc.Sprite).spriteFrame =
				this.uncheckFrame
		}
	}

	clickItem() {}
}
