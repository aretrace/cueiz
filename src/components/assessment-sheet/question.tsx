import { Dispatch, Fragment, SetStateAction } from 'react'

export default function Question({
  id,
  question,
  mixedAnswers,
  correctAnswer,
  selectedAnswer,
  setSelectedAnswers,
  setAreAnswersCorrect,
  hasSubmittedQuiz
}: {
  id: number
  question: string
  mixedAnswers: string[]
  correctAnswer: string
  selectedAnswer: string
  setSelectedAnswers: Dispatch<SetStateAction<string[]>>
  setAreAnswersCorrect: Dispatch<SetStateAction<boolean[]>>
  hasSubmittedQuiz: boolean
}) {
  const hasSelectedAnswer = selectedAnswer !== ''

  // JavaScript needs proper modern conditional expressions
  const handleSelection = (id: number, answer: string) => {
    const newSelectedAnswer = selectedAnswer === answer ? '' : answer
    setSelectedAnswers((prevSelectedAnswers) => {
      const newSelectedAnswers = [...prevSelectedAnswers]
      newSelectedAnswers[id] = hasSelectedAnswer ? newSelectedAnswer : answer
      return newSelectedAnswers
    })
    setAreAnswersCorrect((prevAreAnswersCorrect) => {
      const newAreAnswersCorrect = [...prevAreAnswersCorrect]
      newAreAnswersCorrect[id] = newSelectedAnswer === correctAnswer
      return newAreAnswersCorrect
    })
  }

  return (
    <>
      <h2 className="card-title mb-2 mt-1 select-none">{question}</h2>
      <div className={`card-actions ${hasSubmittedQuiz ? ' pointer-events-none' : ''}`}>
        {mixedAnswers.map((answer: string) => (
          <Fragment key={answer}>
            <button
              className={`btn btn-outline btn-sm shrink text-base hover:shadow-lg
              ${selectedAnswer === answer ? ' bg-base-content text-white' : ''}
              ${
                hasSubmittedQuiz && selectedAnswer === answer && selectedAnswer === correctAnswer
                  ? ' bg-green-500 text-blue-100'
                  : ''
              }
              ${
                hasSubmittedQuiz && selectedAnswer === answer && selectedAnswer !== correctAnswer
                  ? ' bg-red-500 text-blue-100'
                  : ''
              }
              ${
                hasSubmittedQuiz && selectedAnswer !== answer && answer === correctAnswer
                  ? ' border-green-500 text-green-600'
                  : ''
              }`}
              onClick={() => handleSelection(id, answer)}
            >
              {answer}
            </button>
          </Fragment>
        ))}
      </div>
    </>
  )
}
