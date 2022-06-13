// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemButton from "./itemButton"

const { ccclass } = cc._decorator

@ccclass
export default class ItemQuestion extends ItemButton {
	type = "question"

	clickItem() {
		this.manager.onItemClick(true, this.Index)
	}
	// update (dt) {}
}
