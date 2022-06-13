// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameLayoutManager from "./gameLayoutManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class GameManager extends cc.Component {
	static readonly RANG_LENGTH_PAGE: cc.Vec2 = cc.v2(1, 5)

	@property(cc.Prefab)
	gameLayoutPrefab: cc.Prefab = null
	@property(cc.Prefab)
	pagesCirclePrefab: cc.Prefab = null

	@property
	pageCount: number = 5
	page: number
	pageView: cc.PageView
	pageLabel: cc.Label
	arrPagesManager: GameLayoutManager[] = []
	arrPages: cc.Node[] = []
	middleContainer: cc.Node = null

	game_data: cc.Asset = null

	getScore() {
		var score: number = 0
		this.arrPagesManager.forEach((e) => {
			score += e.getScore
		})
		return score
	}

	getTotalScore() {
		var score: number = 0
		this.arrPagesManager.forEach((e) => {
			score += e.getTotalScore
		})
		return score
	}

	onPreviousClick() {
		if (this.page > 0) {
			this.swapPage(this.page, this.page - 1)
		}
	}

	onNextClick() {
		if (this.page < this.pageCount - 1) {
			this.swapPage(this.page, this.page + 1)
		}
	}

	swapPage(from: number, to: number) {
		this.page = to

		// Di chuyen so trang
		var tmp = this.middleContainer.children[from]
		this.middleContainer.removeChild(tmp, true)
		this.middleContainer.insertChild(tmp, to)

		this.node.getChildByName("game_layout_s").removeAllChildren()
		this.node.getChildByName("game_layout_s").addChild(this.arrPages[to])

		// Xoa lua chon trang cu
		this.arrPagesManager[from].clearJustClick()
	}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		// Khu load resources
		cc.resources.load("sample_data", cc.JsonAsset, (err, json) => {
			this.game_data = json
		})

		this.pageCount = Math.max(
			Math.min(this.pageCount, GameManager.RANG_LENGTH_PAGE.y),
			GameManager.RANG_LENGTH_PAGE.x
		)
		for (let index = 0; index < this.pageCount; index++) {
			var obj = cc.instantiate(this.gameLayoutPrefab)
			obj.getComponent(GameLayoutManager).lengthAnswer = index + 1
			this.arrPages.push(obj)
			this.arrPagesManager.push(obj.getComponent(GameLayoutManager))
		}
		this.node.getChildByName("game_layout_s").addChild(this.arrPages[0])

		this.middleContainer = cc.find("navi/navi_bottom/middle_layout/middle")
		for (let index = 1; index < this.pageCount; index++) {
			var obj = cc.instantiate(this.pagesCirclePrefab)
			this.middleContainer.addChild(obj)
		}
	}

	start() {
		this.page = 0
		this.pageLabel = cc
			.find("navi/navi_bottom/middle_layout/middle/pages_circle_big/pages")
			.getComponent(cc.Label)

		this.pageView = this.node.getComponent(cc.PageView)
	}

	update(_dt: any) {
		this.pageLabel.string = this.page + 1 + "/" + this.pageCount
	}
}
