'use client'
import AssessmentSheet from '@/components/assessment-sheet'
import OptionsMenu from '@/components/options-menu'
import { quizFetchOptions, type CategoryName } from '@/data/quiz'
import { useQueryParams } from '@/lib/hooks'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export type AllowedQueryParams = {
  amount: 1 | 2 | 3 | 4 | 5 // TODO: standardize as string everywhere
  category: CategoryName
  difficulty: 'easy' | 'medium' | 'hard'
}

const defaultQueryParams: AllowedQueryParams = {
  amount: 3,
  category: 'Science: Computers',
  difficulty: 'medium'
}

export default function Quiz() {
  const { getQueryParam } = useQueryParams()
  const { data, isFetching, isError, error, failureReason, refetch } = useQuery(
    quizFetchOptions({
      amount: parseInt(getQueryParam('amount', defaultQueryParams.amount.toString())),
      category: getQueryParam('category', defaultQueryParams.category),
      difficulty: getQueryParam('difficulty', defaultQueryParams.difficulty)
    } as AllowedQueryParams)
  )

  const [isOptionsMenuDisabled, setOptionsMenuDisabled] = useState<boolean>(true)
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState<boolean>(false)

  useEffect(() => {
    if (isFetching) {
      setOptionsMenuDisabled(true)
    }
  }, [isFetching])

  if (isError) return <QueryError {...{ error, failureReason, refetch }} />

  return (
    <>
      <OptionsMenu
        {...defaultQueryParams}
        {...{ isFetching, isOptionsMenuDisabled }}
        {...{ setOptionsMenuDisabled, setHasSubmittedQuiz }}
      />
      <AssessmentSheet
        defaultAmount={defaultQueryParams.amount}
        {...{ isFetching, isOptionsMenuDisabled, hasSubmittedQuiz, data, refetch }}
        {...{ setOptionsMenuDisabled, setHasSubmittedQuiz }}
      />
    </>
  )
}

function QueryError({
  error,
  failureReason,
  refetch
}: Pick<UseQueryResult<any, Error>, 'error' | 'failureReason' | 'refetch'>) {
  console.error(error)
  return (
    <>
      <div className="">
        <p className="pb-4 text-2xl">Error: {failureReason?.message}</p>
        <button
          className="btn btn-outline btn-secondary w-full"
          onClick={() => {
            refetch()
          }}
        >
          RETRY
        </button>
      </div>
    </>
  )
}
