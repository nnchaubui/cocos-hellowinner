// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemAnswer from "./itemAnswer"
import ItemButton from "./itemButton"
import ItemQuestion from "./itemQuestion"
import MinigameManager from "../minigameManager"
import { GameList } from "../gameManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class Game1NManager extends MinigameManager {
	static readonly RANGE_LENGTH_ANSWER: cc.Vec2 = cc.v2(1, 5)
	static readonly RANGE_LENGTH_QUESTION: cc.Vec2 = cc.v2(1, 3)

	protected _gameId: string = GameList.GAME_1N

	// @property(cc.Prefab)
	answerPrefab: cc.Prefab = null
	// @property(cc.Prefab)
	questionPrefab: cc.Prefab = null

	arrAnswer: ItemAnswer[] = []
	arrQuestion: ItemQuestion[] = []
	arrConnectTo: number[][] = []

	just_click: ItemButton = null
	lines: cc.Graphics = null

	public get getScore(): boolean {
		if (this.arrAnswer.length == 0) return false

		var score: number = 0
		for (var i = 0; i < this.arrAnswer.length; i++) {
			if (this.arrConnectTo[i].length != this.arrAnswer[i].Solution.length) {
				continue
			}

			this.arrConnectTo[i] = this.arrConnectTo[i].sort((a, b) => a - b)
			for (var j = 0; j < this.arrConnectTo[i].length; j++) {
				if (this.arrConnectTo[i][j] != this.arrAnswer[i].Solution[j]) {
					score--
				}
			}
			score++
		}

		return score == this.getTotalScore
	}

	public get getTotalScore(): number {
		return this.arrAnswer.length
	}

	public clean(): void {
		this.clearJustClick()
	}

	// Gia tri moi cho juct_click
	clearJustClick() {
		this.arrAnswer.forEach((element) => {
			element.node.getComponent(cc.Toggle).isChecked = false
		})
		this.arrQuestion.forEach((element) => {
			element.node.getComponent(cc.Toggle).isChecked = false
		})

		this.just_click = null
	}

	onItemClick(question: boolean, index: number) {
		var item: ItemButton = question
			? this.arrQuestion[index]
			: this.arrAnswer[index]

		// Lua chon moi
		if (this.just_click == null) {
			this.just_click = item
		}
		// Chon lai cai vua chon
		else if (item == this.just_click) {
			this.just_click = null
		}
		// Chon cung mot hang
		else if (item.type == this.just_click.type) {
			this.just_click.node.getComponent(cc.Toggle).isChecked = false
			this.just_click = item
		}
		// Chon 2 hang khac nhau
		else this.connect(this.just_click, item)
	}

	/** Noi tu b_from den b_to */
	connect(b_from: ItemButton, b_to: ItemButton) {
		// Hoan doi vi tri sao cho b_from luon la tang tren con b_to luon la tang duoi
		if (b_from instanceof ItemQuestion) {
			var tmp = b_from
			b_from = b_to
			b_to = tmp
		}

		// Tao ket noi giua tang tren va tang duoi
		if (this.arrConnectTo[b_from.Index].includes(b_to.Index)) {
			// Cung diem den? Xoa.
			const i = this.arrConnectTo[b_from.Index].indexOf(b_to.Index)
			this.arrConnectTo[b_from.Index].splice(i, 1)
		} else {
			// Khac diem den? ok diem den moi.
			this.arrConnectTo[b_from.Index].push(b_to.Index)
		}
		this.clearJustClick()
	}

	exportData() {
		for (let index = 0; index < this.arrAnswer.length; index++) {
			if (!this.arrAnswer[index].node.active) {
				this.arrAnswer.splice(index, 5)
				this.arrConnectTo.splice(index, 5)
				break
			}
		}
		for (let index = 0; index < this.arrQuestion.length; index++) {
			if (!this.arrQuestion[index].node.active) {
				this.arrQuestion.splice(index, 5)
				break
			}
		}
		for (let index = 0; index < this.arrConnectTo.length; index++) {
			this.arrConnectTo[index] = this.arrConnectTo[index].sort((a, b) => a - b)
			this.arrConnectTo[index] = this.arrConnectTo[index].filter((v, i, a) => {
				return v < this.arrQuestion.length
			})

			const sol = this.arrConnectTo[index]
			this.arrAnswer[index].Solution = sol
		}
		const pageData = super.exportData()
		return pageData
	}

	onLoad() {
		super.onLoad()
		this.lines = this.node.getChildByName("line").getComponent(cc.Graphics)
		var answerContainer = this.node
			.getChildByName("game_layout")
			.getChildByName("answers")
		var questionContainer = this.node
			.getChildByName("game_layout")
			.getChildByName("questions")

		// Chinh chieu rong cua trang
		this.node.width = cc.find("Canvas").width

		// Chen prefab va khoi tao gia tri //
		this.data.answer.forEach((ans: any) => {
			var obj = cc.instantiate(this.answerPrefab)
			obj.getComponent(ItemAnswer).data = ans
			obj.getComponent(ItemAnswer).manager = this
			answerContainer.addChild(obj)
			this.arrAnswer.push(obj.getComponent(ItemAnswer))
		})

		this.data.question.forEach((ques: any) => {
			var obj = cc.instantiate(this.questionPrefab)
			obj.getComponent(ItemQuestion).data = ques
			obj.getComponent(ItemQuestion).manager = this
			questionContainer.addChild(obj)
			this.arrQuestion.push(obj.getComponent(ItemQuestion))
		})
	}

	start() {
		for (var index = 0; index < this.arrAnswer.length; index++) {
			this.arrConnectTo.push([])
		}
	}

	update(_dt: number) {
		//Ve duong day
		this.lines.clear()
		for (var i = 0; i < this.arrAnswer.length; i++) {
			if (this.arrConnectTo[i].length != 0 && this.arrAnswer[i].node.active) {
				this.arrConnectTo[i].forEach((targetIndex) => {
					if (!this.arrQuestion[targetIndex].node.active) {
						return
					} // Kiem tra dieu kien. Duong noi chi duoc ve neu ca hai cai cung dang ton tai.
					// Ve duong noi tu answer[i].position den connectTo[answer[i]].position
					var froms = this.lines.node.convertToNodeSpaceAR(
						this.arrAnswer[i].node.convertToWorldSpaceAR(
							cc.v2(0, -this.arrAnswer[i].node.height / 3)
						)
					)
					var tos = this.lines.node.convertToNodeSpaceAR(
						this.arrQuestion[targetIndex].node.convertToWorldSpaceAR(
							cc.v2(0, (this.arrQuestion[targetIndex].node.height * 5) / 6)
						)
					)
					this.lines.moveTo(froms.x, froms.y)
					this.lines.lineTo(tos.x, tos.y)
				})
			}
		}
		this.lines.stroke()
	}
}
