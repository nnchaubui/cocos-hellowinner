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

	static uploadFile(type, target: any) {
		if (cc.sys.isBrowser) {
			let fileInput = document.createElement("input")
			fileInput.type = "file"
			fileInput.accept = "image/png"
			// console.log("ipFile", fileInput)
			fileInput.click()
			fileInput.addEventListener(
				"change",
				() => {
					var img = document.createElement("img")
					var canvas = document.createElement("canvas")
					var reader = new FileReader()
					reader.onload = function (progressEvent) {
						img.src = progressEvent.target.result as string
						img.onload = function () {
							// Day chac la cai cho chinh kich co chu gi
							var ctx = canvas.getContext("2d")
							ctx.drawImage(img, 0, 0)

							var MAX_WIDTH = 800
							var MAX_HEIGHT = 600
							var width = img.width
							var height = img.height

							if (width > height) {
								if (width > MAX_WIDTH) {
									height *= MAX_WIDTH / width
									width = MAX_WIDTH
								}
							} else {
								if (height > MAX_HEIGHT) {
									width *= MAX_HEIGHT / height
									height = MAX_HEIGHT
								}
							}
							canvas.width = width
							canvas.height = height
							var ctx = canvas.getContext("2d")
							ctx.drawImage(img, 0, 0, width, height)
							var dataUrl = canvas.toDataURL("image/png")
							// console.log("buffer", dataUrl)
							dataUrl =
								"data:application/octet-binary;base64," +
								dataUrl.replace("data:image/png;base64,", "")
							fetch(dataUrl)
								.then((res) => res.arrayBuffer())
								.then((buffer) => {
									// console.log("buffer", buffer)
								})
						}
					}
					// console.log("ipFile.files[0]", fileInput.files)
					reader.readAsDataURL(fileInput.files[0])

					// TODO upload
					// Server.loadRes("https://ctm-cms.myg.vn/images/thumbnail/0xd237b25d45b144dbab92f81e5c5c44f7cheems.png", target)
					// Upload cai file vua chon len
					var myHeaders = new Headers()
					myHeaders.append(
						"Cookie",
						".AspNetCore.Session=CfDJ8GmrYVI6VxlFp5hvVMclUtanrpD%2BHH0oRRUDw6oaMn3NwyayHlyo3pNzp%2BEoa5sTRFRu%2Fiycjkfhs3cCAhcMz%2FI7uzsM8IQhc14aMSSnuv8PAShbhhpB538WNIJQxIwHCpD%2BNRNl1pW04TW%2FgN9%2BD%2BQcZFNbTHkI7U%2BOu4E7BK59"
					)

					var formdata = new FormData()
					formdata.append("Item", fileInput.files[0], fileInput.files[0].name)
					formdata.append("ClassItem", "1")

					var requestOptions = {
						method: "POST",
						body: formdata,
						redirect: "follow" as RequestRedirect,
					}

					fetch("http://localhost:5002/Upload", requestOptions)
						.then((response) => response.text())
						.then((result) => {
							// console.log(result)
							const url = JSON.parse(result).url
							Server.loadRes(url, target) // itemAnswerMaker & itemQuestionMaker only
						})
						.catch((error) => console.log("error", error))
				},
				false
			)
		}
	}

	static loadRes(url: string, target: any) {
		cc.assetManager.loadRemote<cc.Texture2D>(url, (err, spr) => {
			target.spriteFrame = new cc.SpriteFrame(spr)
		})
	}

	onSendGameButton() {
		// TODO send
		const gameData: any[] = []
		this.arrPagesmanager.forEach((page) => {
			gameData.push(page.exportData())
		})
		console.log(gameData)
		console.log(JSON.stringify(gameData))


		var myHeaders = new Headers()
		myHeaders.append(
			"Cookie",
			".AspNetCore.Session=CfDJ8NcGdSzUZ81Hlh0bgChgkkol4wqoAFzsQR6veLqIxavmDAa01PLC8W%2FMp%2FfTJ4pg2qhrkB6gnABzEdEBtm5Ozq9Y0RWwAoj%2FlxCGZejFcuXswKXxplt4A%2BPzaHtsKgv6wPOBJcioz7d8I0Q%2Fw35t1ZAWv%2Bb9CV76ADRclyL0tXP3"
		)
		var formdata = new FormData()
		formdata.append(
			"datajson",
			JSON.stringify(gameData)
		)
		formdata.append("LessonId", "d208e744-94df-4915-a2e2-1bc32cceedff")
		formdata.append("GameId", "181c6063-5465-4196-8b39-b77ec1171324")
		var requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow" as RequestRedirect,
		}
		fetch(
			"http://localhost:5002/Api/AddItems?GameId&LessonId&datajson",
			requestOptions
		)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.log("error", error))
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
