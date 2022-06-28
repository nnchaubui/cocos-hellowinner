// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemButton from "./itemButton"
import MinigameManager from "./minigameManager"

const { ccclass } = cc._decorator

@ccclass
export default class ItemAnswer extends ItemButton {
	type = "answer"

	onLoad() {
		super.onLoad()
		cc.assetManager.loadRemote<cc.Texture2D>(
			MinigameManager.baseUrlFile + this.Image,
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
