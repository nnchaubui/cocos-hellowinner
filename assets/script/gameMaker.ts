// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game1NManager from "./game1N/game1NManager"
import ItemAnswer from "./game1N/itemAnswer"
import ItemButton from "./game1N/itemButton"
import GameManager, { GameList } from "./gameManager"
import { AnswerData, QuestionData } from "./jsonData"
import MinigameManager from "./minigameManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class GameMaker extends GameManager {
	/** Them trang vao vi tri index va dich may trang sau do them 1 nac */
	private addPageToIndex(index: number) {
		var obj = cc.instantiate(this.game1NLayoutPrefab)
		obj.getComponent(MinigameManager).metadata = this.emptyData
		obj.active = true
		if (index == -1) {
			this.arrPages.push(obj)
			this.arrPagesManager.push(obj.getComponent(MinigameManager))
			this.swapPage(null, 0)
		} // Trang moi tinh tinh tinh
		else {
			this.arrPages.splice(index + 1, 0, obj)
			this.arrPagesManager.splice(
				index + 1,
				0,
				obj.getComponent(MinigameManager)
			)
			this.swapPage(index, index + 1)
		}
	}

	/** Xoa trang nam o vi tri index va dich may trang sau do xuong 1 nac */
	private removePageFromIndex(index: number) {
		if (this.arrPages.length == 1) {
			this.arrPages.shift()
			this.arrPagesManager.shift()
			this.node.removeAllChildren()
			this.page = -1
		} // Chi con 1 trang
		else if (this.page == this.arrPages.length - 1) {
			this.arrPages.pop()
			this.arrPagesManager.pop()
			this.swapPage(null, this.page - 1)
		} // Xoa trang cuoi danh sach
		else {
			this.arrPages.splice(index, 1)
			this.arrPagesManager.splice(index, 1)
			this.swapPage(null, index)
		} // Xoa nhu binh thuong
	}

	/** Xac dinh so cau tra loi cua trang hien tai */
	setNumAnswer(_event: any, custom: any) {
		const num: number = custom as number
		if (num > this.arrPagesManager[this.page].arrAnswer.length) {
			this.addEmptyAnswer(
				this.arrPagesManager[this.page].arrAnswer.length,
				num - this.arrPagesManager[this.page].arrAnswer.length
			)
		}
		var index = 0

		this.arrPages[this.page]
			.getChildByName("game_layout")
			.getChildByName("answers")
			.children.forEach((child) => {
				index++
				child.active = index <= num
			})
	}

	/** Xac dinh so cau hoi cua trang hien tai */
	setNumQuestion(_event: any, custom: any) {
		const num: number = custom as number
		if (num > this.arrPagesManager[this.page].arrQuestion.length) {
			this.addEmptyQuestion(
				this.arrPagesManager[this.page].arrQuestion.length,
				num - this.arrPagesManager[this.page].arrQuestion.length
			)
		}
		var index = 0
		this.arrPages[this.page]
			.getChildByName("game_layout")
			.getChildByName("questions")
			.children.forEach((child) => {
				index++
				child.active = index <= num
			})
	}

	/** Them count cau tra loi tu vi tri start */
	private addEmptyAnswer(start: number, count: number) {
		for (var index = 0; index < count; index++) {
			const ansData: any = new AnswerData(start + index)
			const ans = cc.instantiate(this.arrPagesManager[this.page].answerPrefab)
			ans.getComponent(ItemButton).data = ansData
			ans.getComponent(ItemButton).manager = this.arrPagesManager[
				this.page
			] as Game1NManager

			this.arrPagesManager[this.page].arrAnswer.push(
				ans.getComponent(ItemAnswer)
			)
			;(this.arrPagesManager[this.page] as Game1NManager).arrConnectTo.push(-1)
			this.arrPages[this.page]
				.getChildByName("game_layout")
				.getChildByName("answers")
				.addChild(ans)
		}
	}

	/** Them count cau hoi tu vi tri start */
	private addEmptyQuestion(start: number, count: number) {
		for (var index = 0; index < count; index++) {
			const quesData: any = new QuestionData(start + index)
			const ques = cc.instantiate(
				this.arrPagesManager[this.page].questionPrefab
			)
			ques.getComponent(ItemButton).data = quesData
			ques.getComponent(ItemButton).manager = this.arrPagesManager[
				this.page
			] as Game1NManager

			this.arrPagesManager[this.page].arrQuestion.push(
				ques.getComponent(ItemAnswer)
			)
			this.arrPages[this.page]
				.getChildByName("game_layout")
				.getChildByName("questions")
				.addChild(ques)
		}
	}

	onPlusButton() {
		if (this.arrPages.length >= 20) {
			console.log("Toi da 20 trang thoi!")
		} else {
			this.addPageToIndex(this.page)
		}
	}

	onMinusButton() {
		if (this.arrPages.length == 0) {
			console.log("Khong con trang de xoa!")
		} else {
			this.removePageFromIndex(this.page)
		}
	}

	onChangedTitle() {
		this.arrPagesManager[this.page].data.Title = this.helpLabel.string
	}

	/** Tao du lieu rong tuech cho trang moi */
	private get emptyData() {
		const pageData: any = {}
		pageData.IdItem = "00000000-0000-0000-0000-000000000000"
		pageData.Title = ""
		pageData.question = []
		pageData.answer = []
		for (let index = 0; index < 3; index++) {
			pageData.question.push(new QuestionData(index))
		}
		for (let index = 0; index < 5; index++) {
			pageData.answer.push(new AnswerData(index))
		}

		const metaData: any = {}
		metaData.jsonData = JSON.stringify(pageData)
		return metaData
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
			.getComponent(cc.EditBox)
	}

	// update (dt) {}
}
