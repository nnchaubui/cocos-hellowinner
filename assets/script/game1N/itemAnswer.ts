// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemButton from "./itemButton"
import GameManager from "../gameManager"
import { AnswerData } from "../jsonData"

const { ccclass } = cc._decorator

@ccclass
export default class ItemAnswer extends ItemButton {
	type = "answer"
	data: AnswerData
	public get Solution(): number[] {
		return this.json.Solution
	}
	public set Solution(value: number[]) {
		this.json.Solution = value
	}

	public exportData(): any {
		const ansData = this.data
		ansData.Json = JSON.stringify(this.json)
		return ansData
	}

	protected loadData() {
		this.updateImage(GameManager.baseUrlFile + this.Image)
		if (this.Sound != "") {
			this.updateSound(GameManager.baseUrlFile + this.Sound)
		}
	}

	updateImage(url: string): void {
		if (url == null || url == "") {
			this.updateProperty("Image", "")
			return
		}

		this.updateProperty("Image", url.replace(GameManager.baseUrlFile, ""))
		cc.assetManager.loadRemote<cc.Texture2D>(url, (err, spr) => {
			this.node
				.getChildByName("mask")
				.getChildByName("sprite")
				.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spr)
		})
	}

	updateSound(url: string): void {
		if (url == null || url == "") {
			this.updateProperty("Sound", "")
			this.node.getComponent(cc.AudioSource).mute = true
			return
		}

		this.updateProperty("Sound", url.replace(GameManager.baseUrlFile, ""))
		cc.assetManager.loadRemote<cc.AudioClip>(url, (err, aud) => {
			this.node.getComponent(cc.AudioSource).mute = false
			this.node.getComponent(cc.AudioSource).clip = aud
		})
	}

	clickItem() {
		this.manager.onItemClick(false, this.Index)
	}

	onLoad(): void {
		super.onLoad()
		if (!this.json.Solution) {
			this.json.Solution = -1
		}
	}
	// update (dt) {}
}
