// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Server from "../../server"
import ItemAnswer from "../itemAnswer"

const { ccclass } = cc._decorator

@ccclass
export default class ItemAnswerMaker extends ItemAnswer {
	onUploadImageClick() {
		Server.uploadFile(
			null,
			this.node
				.getChildByName("mask")
				.getChildByName("sprite")
				.getComponent(cc.Sprite)
		)
	}
}
