// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MinigameManager from "./minigameManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class GameManager extends cc.Component {
	@property(cc.Prefab)
	game1NLayoutPrefab: cc.Prefab = null

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
		this.arrPagesManager[from].clean()
	}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		// Khu load resources
		cc.resources.load("sample_data", cc.JsonAsset, (err, json) => {
			this.game_data = (json as cc.JsonAsset).json
			var arrgames: any[] = this.game_data.data.items

			arrgames.forEach((arrgame) => {
				var obj = cc.instantiate(this.game1NLayoutPrefab)
				obj.getComponent(MinigameManager).metadata = arrgame
				this.arrPages.push(obj)
				this.arrPagesManager.push(obj.getComponent(MinigameManager))
			})
			this.node.addChild(this.arrPages[0])
			this.helpLabel.string = this.arrPagesManager[0].data.Title
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
