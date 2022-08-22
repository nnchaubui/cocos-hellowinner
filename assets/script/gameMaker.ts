// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game1NManager from "./game1N/game1NManager"
import ItemAnswer from "./game1N/itemAnswer"
import ItemButton from "./game1N/itemButton"
import GameManager from "./gameManager"
import { AnswerData, GameData, QuestionData } from "./jsonData"
import MinigameManager from "./minigameManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class GameMaker extends GameManager {
	static readonly MIN_ANSWER = 1
	static readonly MAX_ANSWER = 5
	static readonly MIN_QUESTION = 1
	static readonly MAX_QUESTION = 3
	static readonly MAX_PAGE = 20

	/** Them trang vao vi tri index va dich may trang sau do them 1 nac */
	private addPageToIndex(index: number) {
		var obj = cc.instantiate(this.game1NLayoutPrefab)
		obj.getComponent(MinigameManager).metadata = this.emptyData
		obj.active = true
		if (this.arrPages.length == 0) {
			this.arrPages.push(obj)
			this.arrPagesManager.push(obj.getComponent(MinigameManager))
			this.swapPage(null, 0)
			this.hideHeader(false)
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
			this.hideHeader(true)
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
			const ansData: AnswerData = new AnswerData(start + index)
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
		if (this.arrPages.length >= GameMaker.MAX_PAGE) {
			console.log("Toi da " + GameMaker.MAX_PAGE + "trang thoi!")
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
		const pageData: any = new GameData()
		for (let index = 0; index < GameMaker.MAX_QUESTION; index++) {
			pageData.question.push(new QuestionData(index))
		}
		for (let index = 0; index < GameMaker.MAX_ANSWER; index++) {
			pageData.answer.push(new AnswerData(index))
		}

		const metaData: any = {}
		metaData.jsonData = JSON.stringify(pageData)
		return metaData
	}

	private hideHeader(really: boolean = true) {
		cc.find("navi/help").active = !really
		cc.find("navi/navi_top_right").active = !really
	}

	protected loadData(arrgames: any): void {
		if (arrgames.length == 0) {
			this.hideHeader(true)
		}
		super.loadData(arrgames)
	}

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		window.addEventListener("message", (e) => {
			var data = e.data
			if (data.method == "setimage") {
			}
			if (data.method == "setsound") {
			}
			if (data.method == "loaddata") {
				console.log("Nhận data từ cms")
				this.loadData(data.params.data)
			}
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

		var myHeaders = new Headers()
		myHeaders.append(
			"Cookie",
			".AspNetCore.Session=CfDJ8NcGdSzUZ81Hlh0bgChgkkqkNnWu5HZi6WUdUgt%2B2P2B4P%2BkZJxscMXuiqUZKH5k%2Fu4BOHyCJCR1HMQ6Zu2mIAeib54z7M6tj9Tf0M53XcugXok6QWHgGkmRXowprmY%2BoeTXj%2BV4YFVDNIs%2FZSbBaHZ1%2FosjVqzVoRhC6no7u3UX"
		)

		var requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow" as RequestRedirect,
		}

		fetch("http://localhost:5002/Api/UrlBase", requestOptions)
			.then((response) => response.text())
			.then(
				// (result) => (this.baseUrlfile = JSON.parse(result).fileUrl),
				window.top.display()
			)
			.catch((error) => console.log("error", error))
	}

	// update (dt) {}
}
