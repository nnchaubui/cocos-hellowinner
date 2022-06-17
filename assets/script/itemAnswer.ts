// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemButton from "./itemButton"

const { ccclass } = cc._decorator

@ccclass
export default class ItemAnswer extends ItemButton {
	type = "answer"

	onLoad() {
		super.onLoad()
		if (this.Image.startsWith("https://")) {
			cc.assetManager.loadRemote<cc.Texture2D>(
				"https://i.imgur.com/md1pbW6.png",
				(err, spr) => {
					this.node
						.getChildByName("mask")
						.getChildByName("sprite")
						.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr)
				}
			)
		} else {
			cc.resources.load(this.Image, cc.SpriteFrame, (_err, spr) => {
				this.node
					.getChildByName("mask")
					.getChildByName("sprite")
					.getComponent(cc.Sprite).spriteFrame = spr as cc.SpriteFrame
			})
		}
	}

	clickItem() {
		this.manager.onItemClick(false, this.Index)
	}
	// update (dt) {}
}
