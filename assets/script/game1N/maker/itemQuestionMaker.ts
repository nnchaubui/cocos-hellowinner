// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Server from "../../server"
import ItemQuestion from "../itemQuestion"

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemQuestionMaker extends ItemQuestion {
	@property(cc.SpriteFrame)
	hasSoundFrame: cc.SpriteFrame = null
	@property(cc.SpriteFrame)
	hasntSoundFrame: cc.SpriteFrame = null

	private soundFrame: cc.Sprite = null
	private soundSource: cc.AudioSource = null

	protected loadData() {
		this.node.getChildByName("label").getComponent(cc.EditBox).string =
			this.Text
	}

	private hasSound(): boolean {
		return !this.soundSource.mute
	}

	onTextChanged() {
		this.Text = this.node
			.getChildByName("label")
			.getComponent(cc.EditBox).string
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

	start() {
		this.soundSource.mute = true
	}

	update(dt) {
		super.update(dt)
		this.soundFrame.spriteFrame = this.hasSound()
			? this.hasSoundFrame
			: this.hasntSoundFrame
	}
}
