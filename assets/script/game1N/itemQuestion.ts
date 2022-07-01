// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../gameManager"
import ItemButton from "./itemButton"

const { ccclass } = cc._decorator

@ccclass
export default class ItemQuestion extends ItemButton {
	type = "question"

	public exportData(): any {
		const quesData: any = {}
		// quesData.Id = this.Id
		quesData.Text = this.Text
		quesData.Image = this.Image
		quesData.Index = this.Index
		quesData.Sound = this.Sound
		return quesData
	}

	protected loadData() {
		this.node.getChildByName("label").getComponent(cc.Label).string = this.Text
		if (this.Sound != "") {
			this.updateSound(GameManager.baseUrlFile + this.Sound)
		}
	}

	updateImage(url: string): void {}

	updateSound(url: string): void {
		this.updateProperty("Sound", url.replace(GameManager.baseUrlFile, ""))
		cc.assetManager.loadRemote<cc.AudioClip>(url, (err, aud) => {
			this.node.getComponent(cc.AudioSource).clip = aud
		})
	}

	clickItem() {
		this.manager.onItemClick(true, this.Index)
	}
	// update (dt) {}
}
