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

	@property
	pageCount: number = 5
	page: number
	pageView: cc.PageView
	pageLabel: cc.Label
	arrPages: GameLayoutManager[] = []

	getScore() {
		var score: number = 0
		this.arrPages.forEach((e) => {
			score += e.getScore
		})
		return score
	}

	getTotalScore() {
		var score: number = 0
		this.arrPages.forEach((e) => {
			score += e.getTotalScore
		})
		return score
	}

	onPreviousClick() {
		if (this.page > 0) {
			this.page--
			this.pageView.scrollToPercentHorizontal(
				this.page / (this.pageCount - 1),
				1
			)
		}
	}

	onNextClick() {
		if (this.page < this.pageCount - 1) {
			this.page++
			this.pageView.scrollToPercentHorizontal(
				this.page / (this.pageCount - 1),
				1
			)
		}
	}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		this.pageCount = Math.max(
			Math.min(this.pageCount, GameManager.RANG_LENGTH_PAGE.y),
			GameManager.RANG_LENGTH_PAGE.x
		)
		for (let index = 0; index < this.pageCount; index++) {
			var obj = cc.instantiate(this.gameLayoutPrefab)
			obj.getComponent(GameLayoutManager).lengthAnswer = index + 1
			this.node.getChildByName("game_layout_s").addChild(obj)
			this.arrPages.push(obj.getComponent(GameLayoutManager))
		}
	}

	start() {
		this.page = 0
		this.pageLabel = cc
			.find("navi/navi_bottom/middle_layout/pages")
			.getComponent(cc.Label)

		this.pageView = this.node.getComponent(cc.PageView)
	}

	update(_dt: any) {
		this.pageLabel.string = this.page + 1 + "/" + this.pageCount
	}
}
