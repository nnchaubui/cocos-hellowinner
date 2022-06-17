// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game1NManager from "./game1NManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemButton extends cc.Component {
	data: any = null

	Id: string =  ""
	Image: string =  ""
	IsCorrect: boolean = false
	Json: null
	Sound: string =  ""
	Spine: null
	Text: null
	Solution: number = null

	Index: number = null
	type: string = null
	manager: Game1NManager = null

	toggle: cc.Toggle
	frame: cc.SpriteFrame

	@property(cc.SpriteFrame)
	checkFrame: cc.SpriteFrame = null

	@property(cc.SpriteFrame)
	uncheckFrame: cc.SpriteFrame = null

	loadData()
	{
		this.Id = this.data.Id
		this.Image = this.data.Image
		this.IsCorrect = this.data.IsCorrect
		this.Json = this.data.Json
		this.Sound = this.data.Sound
		this.Spine = this.data.Spine
		this.Text = this.data.Text
		this.Solution = this.data.Solution
		this.Index = this.data.Index
	}

	onLoad() {
		this.loadData()
		this.toggle = this.node.getComponent(cc.Toggle)
	}

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
