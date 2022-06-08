// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemAnswer from "./itemAnswer"
import ItemButton from "./itemButton"
import ItemQuestion from "./itemQuestion"

const { ccclass, property } = cc._decorator

enum Colors {
	Yellow,
	Cyan,
	Violet,
	Pink,
}

@ccclass
export default class GameLayoutManager extends cc.Component {
	static readonly RANGE_LENGTH_ANSWER: cc.Vec2 = cc.v2(1, 5)
	static readonly RANGE_LENGTH_QUESTION: cc.Vec2 = cc.v2(1, 3)

	@property
	lengthAnswer: number = 4
	@property
	lengthQuestion: number = 2
	@property(cc.Prefab)
	answerPrefab: cc.Prefab = null
	@property(cc.Prefab)
	questionPrefab: cc.Prefab = null

	arrAnswer: ItemAnswer[] = []
	arrQuestion: ItemQuestion[] = []
	arrColors: Colors[] = []
	arrConnectTo: ItemQuestion[] = []
	score: number = 0

	just_click: ItemButton = null
	lines: cc.Graphics = null

	public get getScore(): number {
		// TODO score
		var score: number = 0
		this.arrConnectTo.forEach((element) => {
			if (element != null) {
				score++
			}
		})
		return score
	}

	public get getTotalScore(): number {
		return this.lengthAnswer
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

	connect(b_from: ItemButton, b_to: ItemButton) {
		// Hoan doi vi tri sao cho b_from luon la tang tren con b_to luon la tang duoi
		if (b_from instanceof ItemQuestion) {
			var tmp = b_from
			b_from = b_to
			b_to = tmp
		}

		// Tao ket noi giua tang tren va tang duoi
		if (this.arrConnectTo[b_from.id] == b_to) {
			// Cung diem den? Xoa.
			this.arrConnectTo[b_from.id] = null
		} else {
			// Khac diem den? ok diem den moi.
			this.arrConnectTo[b_from.id] = b_to
		}
		this.clearJustClick()
	}

	printDebug() {
		console.log("just-click " + typeof this.just_click)
		console.log("Connect to " + this.arrConnectTo)
		console.log("isChecked")
		this.arrAnswer.forEach((element) => {
			console.log(element.node.getComponent(cc.Toggle).isChecked)
		})
		console.log("&")
		this.arrQuestion.forEach((element) => {
			console.log(element.node.getComponent(cc.Toggle).isChecked)
		})
		console.log("---------")
	}

	onLoad() {
		this.lengthAnswer = Math.max(
			Math.min(this.lengthAnswer, GameLayoutManager.RANGE_LENGTH_ANSWER.y),
			GameLayoutManager.RANGE_LENGTH_ANSWER.x
		)
		this.lengthQuestion = Math.max(
			Math.min(this.lengthQuestion, GameLayoutManager.RANGE_LENGTH_QUESTION.y),
			GameLayoutManager.RANGE_LENGTH_QUESTION.x
		)

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
		for (var i = 0; i < this.lengthAnswer; i++) {
			var opgiech = cc.instantiate(this.answerPrefab)
			opgiech.getComponent(ItemAnswer).id = i
			opgiech.getComponent(ItemAnswer).manager = this
			answerContainer.addChild(opgiech)
			this.arrAnswer.push(opgiech.getComponent(ItemAnswer))
		}

		for (var i = 0; i < this.lengthQuestion; i++) {
			var opgiech = cc.instantiate(this.questionPrefab)
			opgiech.getComponent(ItemQuestion).id = i
			opgiech.getComponent(ItemQuestion).manager = this
			questionContainer.addChild(opgiech)
			this.arrQuestion.push(opgiech.getComponent(ItemQuestion))
		}
	}

	start() {
		this.arrColors = new Array(this.lengthAnswer).fill(Colors.Yellow)
		this.arrConnectTo = new Array(this.lengthAnswer).fill(null)
	}

	update(_dt: number) {
		//Ve duong day
		this.lines.clear()
		for (var i = 0; i < this.arrAnswer.length; i++) {
			if (this.arrConnectTo[i] != null) {
				// Ve duong noi tu answer[i].position den connectTo[answer[i]].position
				var froms = this.lines.node.convertToNodeSpaceAR(
					this.arrAnswer[i].node.convertToWorldSpaceAR(
						cc.v2(0, -this.arrAnswer[i].node.height / 3)
					)
				)
				var tos = this.lines.node.convertToNodeSpaceAR(
					this.arrConnectTo[i].node.convertToWorldSpaceAR(
						cc.v2(0, (this.arrConnectTo[i].node.height * 5) / 6)
					)
				)
				this.lines.moveTo(froms.x, froms.y)
				this.lines.lineTo(tos.x, tos.y)
			}
		}
		this.lines.stroke()
	}
}
