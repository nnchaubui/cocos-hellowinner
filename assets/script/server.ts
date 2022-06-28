// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game1NManager from "./game1N/game1NManager"
import GameManager from "./gameManager"
import MinigameManager from "./minigameManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class Server extends cc.Component {
	arrPagesmanager: MinigameManager[]
	onSendGameButton() {
		// TODO send
		// var myHeaders = new Headers()
		// myHeaders.append(
		// 	"Cookie",
		// 	".AspNetCore.Session=CfDJ8NcGdSzUZ81Hlh0bgChgkkol4wqoAFzsQR6veLqIxavmDAa01PLC8W%2FMp%2FfTJ4pg2qhrkB6gnABzEdEBtm5Ozq9Y0RWwAoj%2FlxCGZejFcuXswKXxplt4A%2BPzaHtsKgv6wPOBJcioz7d8I0Q%2Fw35t1ZAWv%2Bb9CV76ADRclyL0tXP3"
		// )
		// var formdata = new FormData()
		// formdata.append(
		// 	"datajson",
		// 	''
		// )
		// formdata.append("LessonId", "d208e744-94df-4915-a2e2-1bc32cceedff")
		// formdata.append("GameId", "181c6063-5465-4196-8b39-b77ec1171324")
		// var requestOptions = {
		// 	method: "POST",
		// 	headers: myHeaders,
		// 	body: formdata,
		// 	redirect: "follow" as RequestRedirect,
		// }
		// fetch(
		// 	"http://localhost:5002/Api/AddItems?GameId&LessonId&datajson",
		// 	requestOptions
		// )
		// 	.then((response) => response.text())
		// 	.then((result) => console.log(result))
		// 	.catch((error) => console.log("error", error))

		const gameData: any[] = []
		this.arrPagesmanager.forEach((page) => {
			gameData.push(page.exportData())
		})
		console.log(gameData)
		console.log(JSON.stringify(gameData))
	}
	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	start() {
		this.arrPagesmanager = cc
			.find("game")
			.getComponent(GameManager).arrPagesManager
	}

	// update (dt) {}
}
