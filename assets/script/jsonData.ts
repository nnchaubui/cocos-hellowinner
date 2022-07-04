export class ItemData {
	Id?: string
	Text?: string
	Image?: string
	Index?: number
	Sound?: string
	Spine?: any
	Json?: string

	constructor(Index?: number, data?: any) {
		if (data) {
			this.Id = data.Id
			this.Text = data.Text
			this.Image = data.Image
			this.Index = data.Index
			this.Sound = data.Sound
			this.Spine = data.Spine
			this.Json = data.Json
		} else {
			this.Id = ""
			this.Text = ""
			this.Image = ""
			this.Index = Index
			this.Sound = ""
			this.Spine = null
			this.Json = ""
		}
	}
}

export class AnswerData extends ItemData {
	IsCorrect?: boolean

	constructor(Index?: number, data?: any) {
		super(Index, data)
		if (!data) {
			super(Index)
			this.Json = JSON.stringify({ Solution: -1 })
		}
	}
}

export class QuestionData extends ItemData {
	constructor(Index?: number, data?: any) {
		super(Index, data)
	}
}

export class GameData {
	GameIdMini?: string
	IdItem: string
	Title: string
	question: QuestionData[]
	answer: AnswerData[]

	constructor(data?: any) {
		if (data) {
			this.IdItem = data.IdItem
			this.Title = data.Title
			this.question = data.question
			this.answer = data.answer
		} else {
			this.IdItem = "00000000-0000-0000-0000-000000000000"
			this.Title = ""
			this.question = []
			this.answer = []
		}
	}
}
