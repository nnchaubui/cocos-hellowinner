// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./gameManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class Confirm extends cc.Component {
	header: cc.Label = null
	content: cc.Label = null
	score: cc.Label = null
	gameManager: GameManager = null
	confirmButton: cc.Node = null

	show(type: string) {
		this.node.active = true
		this.header.string = type
		this.content.node.active = true
		this.score.node.active = false
		this.confirmButton.active = true
		if (type === "times_up") {
			this.header.string = "Hết giờ!"
			this.show_score()
		} else {
			this.header.string = "Xác nhận"
		}
	}

	show_score() {
		this.confirmButton.active = false
		this.content.node.active = false
		this.score.node.active = true
		this.score.string =
			"Điểm số của bạn là " +
			this.gameManager.getScore() +
			"/" +
			this.gameManager.getTotalScore() +
			". Chúc bạn may mắn lần sau!"
	}

	onSubmitClick() {
		this.show("confirm")
	}

	onCancelClick() {
		this.node.active = false
	}

	onConfirmClick() {
		this.show_score()
	}
	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		this.header = this.node
			.getChildByName("textbox")
			.getChildByName("header")
			.getComponent(cc.Label)
		this.content = this.node
			.getChildByName("textbox")
			.getChildByName("content")
			.getComponent(cc.Label)
		this.score = this.node
			.getChildByName("textbox")
			.getChildByName("score")
			.getComponent(cc.Label)
		this.confirmButton = this.node
			.getChildByName("textbox")
			.getChildByName("nop")

		this.gameManager = cc.find("game").getComponent(GameManager)
	}

	start() {}

	// update (dt) {}
}
