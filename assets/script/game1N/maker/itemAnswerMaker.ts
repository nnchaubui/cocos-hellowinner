// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Server from "../../server"
import ItemAnswer from "../itemAnswer"

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemAnswerMaker extends ItemAnswer {
	@property(cc.SpriteFrame)
	hasSoundFrame: cc.SpriteFrame = null
	@property(cc.SpriteFrame)
	hasntSoundFrame: cc.SpriteFrame = null

	private soundFrame: cc.Sprite = null
	private soundSource: cc.AudioSource = null

	private hasSound(): boolean {
		return !this.soundSource.mute
	}

	onUploadImageClick() {
		Server.uploadFile(this.node, false)
	}

	onAudioButton() {
		if (this.hasSound()) {
			this.updateSound(null)
		} else {
			Server.uploadFile(this.node, true)
		}
	}

	onLoad() {
		super.onLoad()
		this.soundSource = this.node.getComponent(cc.AudioSource)
		this.soundFrame = this.node
			.getChildByName("upload_sound")
			.getComponent(cc.Sprite)
	}

	start()
	{
		this.soundSource.mute = true
	}

	update(dt) {
		super.update(dt)
		this.soundFrame.spriteFrame = this.hasSound()
			? this.hasSoundFrame
			: this.hasntSoundFrame
	}
}
