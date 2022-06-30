export class AnswerData {
	Id: string
	Image: String
	Index: number
	Sound: String
	Solution: number

	constructor(Index: number) {
		this.Id = ""
		this.Image = ""
		this.Index = Index
		this.Sound = ""
		this.Solution = -1
	}
}

export class QuestionData {
	Id: string
	Text: string
	Image: string
	Index: number
	Sound: string

	constructor(Index: number) {
		this.Id = ""
		this.Text = ""
		this.Image = ""
		this.Index = Index
		this.Sound = ""
	}
}
