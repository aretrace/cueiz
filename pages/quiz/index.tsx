import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { BaseSyntheticEvent, Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { QuestionState, QuizData } from '../../common/types'
import Error from '../../components/error'
import QuizLayout from '../../components/layouts/quiz-layout'
import Loading from '../../components/loading'
import OptionMenu from '../../components/option-menu'
import Question from '../../components/question'
import { fetchQuiz, getQueryStringOptions } from '../../data/quiz-data'
import { decodeHTMLEntities } from '../../libs/utils'

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const queryStringOptions = getQueryStringOptions(query)
  const queryClient = new QueryClient()
  await queryClient.invalidateQueries({
    queryKey: ['quiz'],
    refetchType: 'none',
  })
  // queryClient.clear()
  await queryClient.prefetchQuery(['quiz', queryStringOptions], () => fetchQuiz(queryStringOptions))
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      queryStringOptions,
    },
  }
}
export default function Quiz({ queryStringOptions }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const router = useRouter()
  // const queryStringOptions = useMemo(() => getQueryStringOptions(router.query), [router.query])
  const { isLoading, isFetching, isError, data, error, refetch, fetchStatus } = useQuery<any, Error>(
    ['quiz', queryStringOptions],
    () => fetchQuiz(queryStringOptions),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 5,
      cacheTime: 0,
      staleTime: 0,
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
  // see: https://github.com/TanStack/query/discussions/1331#discussioncomment-4830480

  const quizData = data.results.map((item: any, index: number) => {
    const answers = [...item.incorrect_answers, item.correct_answer]
    return {
      id: index + 1,
      question: item.question,
      answers,
      correctAnswer: item.correct_answer,
    }
  }) as QuizData[]

  const initialize = {
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

  const [questionsStates, setQuestionsStates] = useState(initialize.questionsStates)
  const [submitButtonValue, setSubmitButtonValue] = useState(initialize.submitButtonValue)
  const [hasSubmitted, setHasSubmitted] = useState(initialize.hasSubmitted)

  useEffect(
    function recalcQuestionsStatesOnRefetch() {
      setQuestionsStates(() => initialize.questionsStates)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchStatus]
  )

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

  function submitHandler(e: BaseSyntheticEvent) {
    e.preventDefault()
    if (hasSubmitted) {
      initialize.resetAll()
      refetch({ throwOnError: true })
      return
    }
    setHasSubmitted(() => true)
    setSubmitButtonValue(() => 'New Quiz')
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

  return (
    <>
      <div>
        {/* <div className="pointer-events-none opacity-80 grayscale"> */}
        <OptionMenu {...queryStringOptions} />
      </div>
      <div className="">
        {/* <div className="pointer-events-none blur-sm grayscale"> */}
        {isLoading || isFetching ? (
          <Loading {...{ amount: queryStringOptions.amount }} />
        ) : (
          quizData.map((item, index) => {
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
                {index < quizData.length - 1 ? <div className="divider mb-0"></div> : <div className="my-6"></div>}
              </Fragment>
            )
          })
        )}
        <div className="flex gap-5">
          {hasSubmitted && (
            <div className="flex flex-none items-center justify-center">
              <h3 className="flex-1 text-lg font-semibold">
                {`You got ${numberOfCorrectAnswers}/${quizData.length} correct!`}
              </h3>
            </div>
          )}
          {!(isLoading || isFetching) && (
            <input
              type="button"
              className={`btn-primary no-animation btn mt-2 flex-auto text-white`}
              onClick={(e) => submitHandler(e)}
              disabled={!allAreSelected}
              value={submitButtonValue}
            />
          )}
        </div>
      </div>
    </>
  )
}

Quiz.getLayout = function getLayout(page: React.ReactNode) {
  return <QuizLayout>{page}</QuizLayout>
}
