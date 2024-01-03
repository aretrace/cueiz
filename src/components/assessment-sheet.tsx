'use client'
import { useQueryParams } from '@/lib/hooks'
import { randSplice } from '@/lib/utils'
import { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState } from 'react'
import Question from './assessment-sheet/question'
import QuestionsSkeleton from './questions-skeleton'
// import ConfettiExplosion from 'react-confetti-explosion'
import { QuizData } from '@/data/quiz'
import Confetti from 'react-dom-confetti'

export default function AssessmentSheet({
  amount: defaultAmount,
  isFetching,
  isOptionsMenuDisabled,
  data,
  refetch
}: {
  amount: number
  isFetching: boolean
  isOptionsMenuDisabled: boolean
  setOptionsMenuDisabled: Dispatch<SetStateAction<boolean>>
  data: QuizData | undefined // github.com/TanStack/query/issues/2288
  refetch: () => void
}) {
  const { getQueryParam } = useQueryParams()
  const amount = parseInt(getQueryParam('amount', defaultAmount.toString()))
  const { rateLimited, rawQuestions } = data!

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(defaultAmount).fill(''))
  const [areAnswersCorrect, setAreAnswersCorrect] = useState<boolean[]>(
    Array(defaultAmount).fill(false)
  )
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)

  const areAllAnswersAreSelected = selectedAnswers.every((answer) => answer !== '')
  const areAllAnswersAreCorrect = areAnswersCorrect.every((answer) => answer === true)
  const numberOfCorrectAnswers = areAnswersCorrect.filter((answer) => answer === true).length

  useEffect(() => {
    if (hasSubmitted) {
      // Resetting the hasSubmitted state whenever form controls are changed
      setHasSubmitted(false)
    }
  }, [isFetching])

  const questionsWithAnswers = useMemo(() => {
    // questionsWithAnswers items are memoized
    // between fetches, so we need to reset them
    setSelectedAnswers(Array(amount).fill(''))
    setAreAnswersCorrect(Array(amount).fill(false))
    return rawQuestions?.map(({ question, incorrectAnswers, correctAnswer }, index: number) => {
      const mixedAnswers = randSplice(incorrectAnswers, correctAnswer)
      return {
        id: index,
        question: question,
        mixedAnswers,
        correctAnswer
      }
    })
  }, [rawQuestions])

  if (isFetching)
    return (
      <>
        <QuestionsSkeleton {...{ amount }} />
      </>
    )

  if (rateLimited)
    return (
      <>
        <h1 className="animate-bounce text-3xl text-neutral-700">You may want to slow down.</h1>
      </>
    )

  return (
    <>
      {questionsWithAnswers?.map(({ id, question, mixedAnswers, correctAnswer }, index: number) => {
        return (
          <Fragment key={question}>
            <Question
              {...{ id, question, mixedAnswers, correctAnswer }}
              {...{ selectedAnswer: selectedAnswers[id] }}
              {...{ setSelectedAnswers, setAreAnswersCorrect, hasSubmitted }}
            />
            {index < questionsWithAnswers?.length - 1 ? (
              <hr className="divider mb-0 border-none" />
            ) : (
              <hr className="mt-1 border-none" />
            )}
          </Fragment>
        )
      })}
      <div className="ml-16">
        <Confetti
          active={hasSubmitted && areAllAnswersAreCorrect}
          config={{
            spread: 360,
            startVelocity: 40,
            elementCount: 125,
            dragFriction: 0.3,
            duration: 3000,
            stagger: 3,
            width: '10px',
            height: '10px'
          }}
        />
      </div>
      <div className="flex gap-5 overflow-x-auto">
        {hasSubmitted && (
          <div className="flex flex-none items-center justify-center">
            <h3 className="mt-1 flex-1 text-lg font-semibold">
              {`You got ${numberOfCorrectAnswers}/${questionsWithAnswers?.length} correct${
                areAllAnswersAreCorrect ? '!' : ''
              }`}
            </h3>
            {/* {allAnswersAreCorrect && <ConfettiExplosion />} */}
          </div>
        )}
        {!isFetching && (
          <input
            type="button"
            className={`btn btn-primary no-animation mt-1 flex-auto text-white`}
            onClick={() => {
              if (!hasSubmitted) {
                setHasSubmitted(true)
              } else {
                refetch()
              }
            }}
            disabled={!areAllAnswersAreSelected || (hasSubmitted && isOptionsMenuDisabled)}
            value={
              !areAllAnswersAreSelected
                ? 'Answer all Questions'
                : !hasSubmitted
                  ? 'Submit'
                  : 'Try Again'
            }
          />
        )}
      </div>
    </>
  )
}
