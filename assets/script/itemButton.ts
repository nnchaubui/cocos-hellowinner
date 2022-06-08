// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameLayoutManager from "./gameLayoutManager"

const { ccclass } = cc._decorator

@ccclass
export default class ItemButton extends cc.Component {
	id: number = null
	type: string = null
	manager: GameLayoutManager = null

	clickItem() {}
}
