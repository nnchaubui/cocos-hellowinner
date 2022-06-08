// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Help extends cc.Component {
	onHelpClick()
	{
		this.node.getChildByName("popup").active = !this.node.getChildByName("popup").active
	}

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	start() {

	}

	// update (dt) {}
}
