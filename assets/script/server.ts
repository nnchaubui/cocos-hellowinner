// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemButton from "./game1N/itemButton"
import GameManager from "./gameManager"
import MinigameManager from "./minigameManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class Server extends cc.Component {
	arrPagesmanager: MinigameManager[]

	static uploadFile(target: cc.Node, audioOnly: boolean) {
		if (cc.sys.isBrowser) {
			let fileInput = document.createElement("input")
			fileInput.type = "file"
			fileInput.accept = audioOnly ? "mp3" : "image/png/mp3"
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
							// Cha hieu kieu gi
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
					reader.readAsDataURL(fileInput.files[0])

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
						headers: myHeaders,
						body: formdata,
						redirect: "follow" as RequestRedirect,
					}

					fetch(
						"https://dev-cms-teacher.consangtao.vn/Api/UploadFile",
						requestOptions
					)
						.then((response) => response.text())
						.then((result) => {
							const url = JSON.parse(result).url
							const ext = url.substring(url.length - 3)
							if (ext == "mp3") {
								target.getComponent(ItemButton).updateSound(url)
							} else {
								target.getComponent(ItemButton).updateImage(url)
							}
						})
						.catch((error) => console.log("error", error))
				},
				false
			)
		}
	}

	onSendGameButton() {
		const gameData: any[] = []
		this.arrPagesmanager.forEach((page) => {
			gameData.push(page.exportData())
		})
		window.top.receiveData(JSON.stringify(gameData))	// Goi tu server chu khong them choi oi API nua
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
