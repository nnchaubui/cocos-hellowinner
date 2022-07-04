// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../gameManager"
import { ItemData } from "../jsonData"
import Game1NManager from "./game1NManager"

const { ccclass, property } = cc._decorator

@ccclass
export default abstract class ItemButton extends cc.Component {
	data: ItemData = null
	protected json: any = null


	public get Id(): string {
		return this.data.Id
	}
	public get Image(): string {
		return this.data.Image
	}
	public get Json(): string {
		return this.data.Json
	}
	public get Sound(): string {
		return this.data.Sound
	}
	public get Spine(): any {
		return this.data.Spine
	}
	public get Text(): string {
		return this.data.Text
	}
	protected set Text(text: string) {
		this.data.Text = text
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

	protected abstract loadData(): void
	abstract updateImage(url: string): void
	abstract updateSound(url: string): void

	public updateProperty(pName: string, pValue: any) {
		switch (pName) {
			case "Id":
				this.data.Id = pValue
				break
			case "Image":
				this.data.Image = pValue
				break
			case "Sound":
				this.data.Sound = pValue
				break
			default:
				break
		}
	}

	clickItem() {}

	onLoad() {
		this.json = !this.data.Json ? {} : JSON.parse(this.data.Json)
		this.toggle = this.node.getComponent(cc.Toggle)
		this.loadData()
	}

	protected update(dt: number): void {
		if (this.toggle.isChecked) {
			this.node.getComponentInChildren(cc.Sprite).spriteFrame = this.checkFrame
		} else {
			this.node.getComponentInChildren(cc.Sprite).spriteFrame =
				this.uncheckFrame
		}
	}
}
