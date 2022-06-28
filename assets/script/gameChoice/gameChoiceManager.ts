// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameList } from "../gameManager"
import MinigameManager from "../minigameManager"

const { ccclass } = cc._decorator

@ccclass
export default class GameChoiceManager extends MinigameManager {
	protected _gameId: string = GameList.GAME_CHOICE
	arrAnswer: any[]
	arrQuestion: any[]

	public get getScore(): boolean {
		return true
	}

	// onLoad () {}

	start() {}

	// update (dt) {}
}
