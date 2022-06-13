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
	arrPages: GameLayoutManager[] = []
	middleContainer: cc.Node = null

	game_data: cc.JsonAsset = null

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

		// Di chuyen trang
		cc.tween(this.node.getChildByName("game_layout_s"))
			.to(
				0.5,
				{
					x:
						-(to / this.pageCount) *
						this.node.getChildByName("game_layout_s").width,
				},
				{
					easing: "smooth",
				}
			)
			.start()

		// Xoa lua chon trang cu
		this.arrPages[from].clearJustClick()
	}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		// Khu load resources
		cc.resources.load("sample_data", cc.JsonAsset, (err, json) => {
			this.game_data = json as cc.JsonAsset
			var arrgames: any[] = this.game_data.json.data.items

			arrgames.forEach((arrgame) => {
				var obj = cc.instantiate(this.gameLayoutPrefab)
				obj.getComponent(GameLayoutManager).data = JSON.parse(arrgame.jsonData)
				this.node.getChildByName("game_layout_s").addChild(obj)
				this.arrPages.push(obj.getComponent(GameLayoutManager))
			})
			this.pageCount = arrgames.length

			this.middleContainer = cc.find("navi/navi_bottom/middle_layout/middle")
			for (let index = 1; index < this.pageCount; index++) {
				var obj = cc.instantiate(this.pagesCirclePrefab)
				this.middleContainer.addChild(obj)
			}
		})
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
