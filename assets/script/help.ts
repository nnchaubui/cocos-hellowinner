// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator

@ccclass
export default class Help extends cc.Component {
	popup: cc.Node = null
	isActive: boolean = false
	onHelpClick() {
		if (this.isActive) {
			cc.tween(this.popup).to(0.2, { opacity: 0 }).start()
		} else {
			cc.tween(this.popup).to(0.2, { opacity: 255 }).start()
		}
		this.isActive = !this.isActive
	}

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	start() {
		this.popup = this.node.getChildByName("popup")
	}

	// update (dt) {}
}
