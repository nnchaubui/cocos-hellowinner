// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Confirm from "./confirm"

const { ccclass, property } = cc._decorator

@ccclass
export default class NewClass extends cc.Component {
	@property(cc.Label)
	label: cc.Label = null

	@property
	time_left: number = 180

	is_times_up: boolean = false

	times_up() {
		this.is_times_up = true
		cc.find("confirm").getComponent(Confirm).show("times_up")
	}

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	start() {}

	update(dt: number) {
		if (this.time_left <= 0 && !this.is_times_up) {
			this.times_up()
		} else if (!this.is_times_up) {
			this.time_left -= dt
			var minutes: number = Math.floor(this.time_left / 60)
			var seconds: number = Math.floor(this.time_left - minutes * 60)
			this.label.string = minutes + ":" + seconds
			if (this.time_left <= 150) {
				this.node.color = cc.color(180, 23, 23)
			}
		}
	}
}
