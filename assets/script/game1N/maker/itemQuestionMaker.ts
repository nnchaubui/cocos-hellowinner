// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemQuestion from "../itemQuestion"

const { ccclass } = cc._decorator

@ccclass
export default class ItemQuestionMaker extends ItemQuestion {
	protected loadData() {
		this.node.getChildByName("label").getComponent(cc.EditBox).string =
			this.Text
	}

	onTextChanged() {
		this.Text = this.node
			.getChildByName("label")
			.getComponent(cc.EditBox).string
	}
}
