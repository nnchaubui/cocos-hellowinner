// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemButton from "./itemButton"
import GameManager from "../gameManager"

const { ccclass } = cc._decorator

@ccclass
export default class ItemAnswer extends ItemButton {
	type = "answer"

	public exportData(): any {
		const ansData: any = {}
		ansData.Id = this.Id
		ansData.Image = this.Image
		ansData.Index = this.Index
		ansData.Sound = this.Sound
		ansData.Solution = this.Solution
		return ansData
	}

	protected loadData() {
		cc.assetManager.loadRemote<cc.Texture2D>(
			GameManager.baseUrlFile + this.Image,
			(err, spr) => {
				this.node
					.getChildByName("mask")
					.getChildByName("sprite")
					.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr)
			}
		)
	}

	clickItem() {
		this.manager.onItemClick(false, this.Index)
	}
	// update (dt) {}
}
