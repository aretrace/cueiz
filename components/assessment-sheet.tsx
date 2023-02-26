import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { BaseSyntheticEvent, Dispatch, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'

import { QuestionState, QuizData } from '../common/types'
import { ascertainQueryStringOptions, fetchQuizData } from '../data/quiz-data'
import { decodeHTMLEntities } from '../libs/utils'
import Loading from './loading'
import Question from './question'

export default function AssessmentSheet({
  setQueryError,
}: {
  setQueryError: Dispatch<{ isError: boolean; error: Error | null }>
}) {
  const router = useRouter()
  const queryStringOptions = ascertainQueryStringOptions(router.query)
  const { isLoading, isFetching, isError, data, error, refetch, fetchStatus } = useQuery<any, Error>(
    ['quiz', queryStringOptions],
    () => fetchQuizData(queryStringOptions),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 5,
      cacheTime: 0,
      staleTime: 0,
      // TODO: `initialData??`, get rid of initial undefined data
      select(rawData) {
        rawData.results.forEach((item: any) => {
          item.question = decodeHTMLEntities(item.question)?.trim()
          item.correct_answer = decodeHTMLEntities(item.correct_answer)?.trim()
          item.incorrect_answers = item.incorrect_answers.map((incorrect_answer: any) =>
            decodeHTMLEntities(incorrect_answer)?.trim()
          )
        })
        const sterilizedData = rawData
        return sterilizedData
      },
    }
  )

  const quizData = data?.results.map((item: any, index: number) => {
    const answers = [...item.incorrect_answers, item.correct_answer]
    return {
      id: index + 1,
      question: item.question,
      answers,
      correctAnswer: item.correct_answer,
    }
  }) as QuizData[]

  const defaultQuizStateValues = {
    questionsStates: quizData?.map(
      (questionState) =>
        ({
          id: questionState.id,
          isAnswerSelected: false,
          isAnswerCorrect: false,
        } as QuestionState)
    ),
    resetQuestionsStates() {
      setQuestionsStates(() => this.questionsStates)
    },
    hasSubmitted: false,
    resetHasSubmitted() {
      setHasSubmitted(() => this.hasSubmitted)
    },
    resetAll() {
      this.resetQuestionsStates()
      this.resetHasSubmitted()
    },
  }

  const [questionsStates, setQuestionsStates] = useState(defaultQuizStateValues.questionsStates)
  const [hasSubmitted, setHasSubmitted] = useState(defaultQuizStateValues.hasSubmitted)

  useEffect(
    function resetQuizStateValuesWhenOptionsChange() {
      defaultQuizStateValues.resetAll()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchStatus]
  )

  const allAreSelected = questionsStates?.every((questionState) => questionState.isAnswerSelected)
  const allAreCorrect = questionsStates?.every((questionState) => questionState.isAnswerCorrect)
  const numberOfCorrectAnswers = questionsStates?.filter((questionState) => questionState.isAnswerCorrect).length

  const questionsStatesHandler = useCallback(
    (selectedAnswerId: number, isAnswerSelected: boolean, isAnswerCorrect: boolean) => {
      setQuestionsStates((prevQuestionsStates) => {
        return prevQuestionsStates?.map((prevQuestionState) => {
          if (selectedAnswerId === prevQuestionState.id) {
            return {
              ...prevQuestionState,
              isAnswerSelected,
              isAnswerCorrect,
            } as QuestionState
          }
          return { ...prevQuestionState } as QuestionState
        })
      })
    },
    []
  )

  function submitHandler(e: BaseSyntheticEvent) {
    e.preventDefault()
    if (hasSubmitted) {
      defaultQuizStateValues.resetAll()
      refetch({ throwOnError: true })
      return
    }
    if (allAreSelected) {
      setHasSubmitted(() => true)
      return
    }
  }

  useEffect(
    function liftQueryErrorUp() {
      if (isError) {
        setQueryError({ isError, error })
      }
    },
    [isError, error, setQueryError]
  )

  return (
    <>
      {isLoading || isFetching ? (
        <Loading {...{ amount: queryStringOptions.amount }} />
      ) : (
        quizData?.map((item, index) => {
          return (
            <Fragment key={item.question}>
              <Question
                {...{
                  questionId: item.id,
                  question: item.question,
                  answers: item.answers,
                  correctAnswer: item.correctAnswer,
                  questionsStatesHandler,
                  hasSubmitted,
                  fetchStatus,
                }}
              />
              {index < quizData?.length - 1 ? (
                <hr className="divider mb-0 border-none" />
              ) : (
                <hr className="my-1 border-none" />
              )}
            </Fragment>
          )
        })
      )}
      <div className="flex gap-5 overflow-x-auto">
        {hasSubmitted && (
          <div className="flex flex-none items-center justify-center">
            <h3 className="flex-1 text-lg font-semibold">
              {`You got ${numberOfCorrectAnswers}/${quizData?.length} correct${allAreCorrect ? '!' : ''}`}
            </h3>
            {allAreCorrect && <ConfettiExplosion />}
          </div>
        )}
        {!(isLoading || isFetching) && (
          <input
            type="button"
            className="btn-primary no-animation btn mt-2 flex-auto text-white"
            onClick={(e) => submitHandler(e)}
            disabled={!allAreSelected}
            value={!allAreSelected ? 'Answer all questions' : !hasSubmitted ? 'Submit' : 'Try again'}
          />
        )}
      </div>
    </>
  )
}
