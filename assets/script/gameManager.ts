// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MinigameManager from "./minigameManager"

const { ccclass, property } = cc._decorator

enum GameList {
	GAME_1N = "3c5e8770-a6ab-48d4-ac4d-d6fd948aaf2a",
	GAME_CHOICE = "hahahuhu-hehe-hihi-hoho-vuioilavui99",
}

@ccclass
export default class GameManager extends cc.Component {
	@property(cc.Prefab)
	game1NLayoutPrefab: cc.Prefab = null
	@property(cc.Prefab)
	gameChoicePrefab: cc.Prefab = null

	page: number
	pageLabel: cc.Label
	helpLabel: cc.Label

	arrPagesManager: MinigameManager[] = []
	arrPages: cc.Node[] = []

	game_data: any = null

	getScore() {
		var score: number = 0
		this.arrPagesManager.forEach((e) => {
			score += e.getScore ? 1 : 0
		})
		return score
	}

	getTotalScore() {
		return this.arrPagesManager.length
	}

	onPreviousClick() {
		this.swapPage(
			this.page,
			(this.page + this.arrPagesManager.length - 1) %
				this.arrPagesManager.length
		)
	}

	onNextClick() {
		this.swapPage(this.page, (this.page + 1) % this.arrPagesManager.length)
	}

	swapPage(from: number, to: number) {
		this.page = to

		// Chuyen trang
		this.node.removeAllChildren()
		this.node.addChild(this.arrPages[to])
		this.helpLabel.string = this.arrPagesManager[to].data.Title

		// Xoa lua chon trang cu
		if (from != null) {
			this.arrPagesManager[from].clean()
		}
	}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		// Khu load resources
		cc.resources.load("sample_data", cc.JsonAsset, (err, json) => {
			this.game_data = (json as cc.JsonAsset).json
			var arrgames: any[] = this.game_data.data.items

			arrgames.forEach((arrgame) => {
				var obj: cc.Node
				switch (arrgame.gameId) {
					case GameList.GAME_1N:
						obj = cc.instantiate(this.game1NLayoutPrefab)
						break
					case GameList.GAME_CHOICE:
						obj = cc.instantiate(this.gameChoicePrefab)
						break
					default:
						obj = cc.instantiate(this.game1NLayoutPrefab)
						break
				}
				obj.getComponent(MinigameManager).metadata = arrgame
				this.node.addChild(obj)
				this.arrPages.push(obj)
				this.arrPagesManager.push(obj.getComponent(MinigameManager))
			})
			this.swapPage(null, 0)
		})
	}

	start() {
		this.page = 0
		this.pageLabel = cc
			.find("navi/navi_bottom/middle_layout/middle/pages_circle_big/pages")
			.getComponent(cc.Label)
		this.helpLabel = cc
			.find("navi/help/popup/help_label")
			.getComponent(cc.Label)
	}

	update(_dt: any) {
		this.pageLabel.string = this.page + 1 + "/" + this.arrPagesManager.length
	}
}
