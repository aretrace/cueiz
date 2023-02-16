export type QuizData = {
  id: number
  question: string
  answers: string[]
  correctAnswer: string
}

export type QuestionState = {
  id: number
  isAnswerSelected: boolean
  isAnswerCorrect: boolean
}
