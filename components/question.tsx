import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useMemo } from 'react';

import { shuffleArray } from '../libs/utils';

export default function Question({
  questionId,
  question,
  answers,
  correctAnswer,
  questionsStatesHandler,
  hasSubmitted,
  fetchStatus,
}: {
  questionId: number
  question: string
  answers: string[]
  correctAnswer: string
  questionsStatesHandler: (selectedAnswerId: number, isAnswerSelected: boolean, isAnswerCorrect: boolean) => unknown
  hasSubmitted: boolean
  fetchStatus: boolean | string
}) {
  const defaultQuestionStateValues = {
    selectedAnswerValue: '',
    resetSelectedAnswerValue() {
      setSelectedAnswerValue(() => this.selectedAnswerValue)
    },
    resetAll() {
      this.resetSelectedAnswerValue()
    },
  }

  const [selectedAnswerValue, setSelectedAnswerValue] = useState(defaultQuestionStateValues.selectedAnswerValue)

  const isAnswerSelected = selectedAnswerValue ? true : false
  const isAnswerCorrect = selectedAnswerValue == correctAnswer

  useEffect(
    function resetSelectedAnswer() {
      defaultQuestionStateValues.resetAll()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchStatus]
  )

  const randomizedAnswers = useMemo(
    () => shuffleArray(answers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  function selectionHandler(selectionValue: string) {
    setSelectedAnswerValue(() => selectionValue)
  }

  // TODO: how to refactor this into an event handler
  useEffect(
    function setSelectedAnswerQuestionsStates() {
      questionsStatesHandler(questionId, isAnswerSelected, isAnswerCorrect)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAnswerValue]
  )

  return (
    <>
      <h2 className="card-title mt-1 mb-2">{question}</h2>
      <div className="card-actions">
        {randomizedAnswers.map((answer: string) => (
          <div key={answer} className={'contents'}>
            <button
              className={`btn-outline btn-sm btn shrink text-base hover:shadow-lg
              ${selectedAnswerValue === answer ? ' bg-base-content text-blue-100' : ''}
              ${hasSubmitted ? ' pointer-events-none' : ''}
              ${
                hasSubmitted && selectedAnswerValue === answer && selectedAnswerValue === correctAnswer
                  ? ' bg-green-500 text-blue-100'
                  : ''
              }
              ${
                hasSubmitted && selectedAnswerValue === answer && selectedAnswerValue !== correctAnswer
                  ? ' bg-red-500 text-blue-100'
                  : ''
              }
              ${
                hasSubmitted && selectedAnswerValue !== answer && answer === correctAnswer
                  ? ' border-green-500 text-green-500'
                  : ''
              }
              `}
              onClick={(e: BaseSyntheticEvent) => {
                e.preventDefault()
                selectionHandler(e.target.textContent)
              }}
            >
              {answer}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
