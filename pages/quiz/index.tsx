import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { BaseSyntheticEvent, Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { QuestionState, QuizData } from '../../common/types';
import Error from '../../components/error';
import QuizLayout from '../../components/layouts/quiz-layout';
import Loading from '../../components/loading';
import Question from '../../components/question';
import { decodeHTMLEntities } from '../../libs/utils';

async function fetchQuiz(amount?: number) {
  // TODO: finish implementing options menu (use solito useParam)
  amount = amount ?? 4

  const url = `https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=easy&type=multiple`
  const res = await fetch(url)
  return res.json()
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const amount = context.query.amount ? parseInt(context.query.amount as string) : 4
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['quiz', amount], () => fetchQuiz(amount))
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      amount,
    },
  }
}

export default function Quiz({ amount }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isLoading, isFetching, isError, data, error, refetch, fetchStatus } = useQuery<any, Error>(
    ['quiz', amount],
    () => fetchQuiz(amount),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 5,
      cacheTime: 0,
      staleTime: Infinity,
      // TODO: decode HTML Entities here, not working with naive approach
      // select(rawData) {
      //
      // },
    }
  )
  // see: https://github.com/TanStack/query/discussions/1331#discussioncomment-4830480
  // const patchedData = data ?? { results: [...] }

  // TODO: see select option in useQuery
  data.results.map((item: any) => {
    item.question = decodeHTMLEntities(item.question)?.trim()
    item.correct_answer = decodeHTMLEntities(item.correct_answer)?.trim()
    item.incorrect_answers = item.incorrect_answers.map((incorrect_answer: any) =>
      decodeHTMLEntities(incorrect_answer)?.trim()
    )
  })

  const quizData = data.results.map((item: any, index: number) => {
    const answers = [...item.incorrect_answers, item.correct_answer]
    return {
      id: index + 1,
      question: item.question,
      answers,
      correctAnswer: item.correct_answer,
    }
  }) as QuizData[]

  const initialize = useMemo(() => {
    return {
      questionsStates: quizData.map(
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
      submitButtonValue: '',
      resetSubmitButtonValue() {
        setSubmitButtonValue(() => this.submitButtonValue)
      },
      hasSubmitted: false,
      resetHasSubmitted() {
        setHasSubmitted(() => this.hasSubmitted)
      },
      resetAll() {
        this.resetQuestionsStates()
        this.resetSubmitButtonValue()
        this.resetHasSubmitted()
      },
    }
  }, [quizData])
  const [questionsStates, setQuestionsStates] = useState(initialize.questionsStates)
  const [submitButtonValue, setSubmitButtonValue] = useState(initialize.submitButtonValue)
  const [hasSubmitted, setHasSubmitted] = useState(initialize.hasSubmitted)

  const allAreSelected = questionsStates.every((questionState) => questionState.isAnswerSelected)
  const allAreCorrect = questionsStates.every((questionState) => questionState.isAnswerCorrect) // TODO: use this
  const numberOfCorrectAnswers = questionsStates.filter((questionState) => questionState.isAnswerCorrect).length

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

  useEffect(
    function handleSubmitButtonValueState() {
      if (allAreSelected) {
        setSubmitButtonValue(() => 'Submit')
      } else {
        setSubmitButtonValue(() => 'Answer all questions')
      }
    },
    [allAreSelected]
  )

  async function submitHandler(e: BaseSyntheticEvent) {
    e.preventDefault()
    if (hasSubmitted) {
      initialize.resetAll()
      refetch({ throwOnError: true })
      return
    }
    setHasSubmitted(() => true)
    setSubmitButtonValue(() => 'Play again')
  }

  // TODO: fix rehydration error, is it something to do with randomizedAnswers?
  // https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  // https://traviswimer.com/blog/easily-fix-react-hydration-errors/
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }

  if (isError) return <Error {...{ error }} />
  if (isLoading || isFetching) return <Loading />

  return (
    <>
      {quizData.map((item, index) => {
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
            {index < quizData.length - 1 ? <div className="divider mb-0"></div> : <div className="my-2"></div>}
          </Fragment>
        )
      })}
      <div className="flex gap-5">
        {hasSubmitted && (
          <div className="flex flex-none items-center justify-center">
            <h3 className="flex-1 text-lg font-semibold">
              {`You got ${numberOfCorrectAnswers}/${quizData.length} correct!`}
            </h3>
          </div>
        )}
        <input
          type="submit"
          className={`btn-primary no-animation btn flex-auto text-white`}
          onClick={(e) => submitHandler(e)}
          disabled={!allAreSelected}
          value={submitButtonValue}
        />
      </div>
    </>
  )
}

Quiz.getLayout = function getLayout(page: React.ReactNode) {
  return <QuizLayout>{page}</QuizLayout>
}
