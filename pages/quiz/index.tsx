import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import styles from 'styles/quiz-background.module.css'

import Error from '../../components/error'
import { fetchQuizData, ascertainQueryStringOptions } from '../../data/quiz-data'
import AssessmentSheet from '../../components/assessment-sheet'
import { useRouter } from 'next/router'
import OptionMenu from '../../components/option-menu'
import { QuizQueryStringOptions } from '../../common/types'
import { ParsedUrlQuery } from 'querystring'

// First request should be rendered on the server,
// subsequent requests should be rendered on the client
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const queryStringOptions = ascertainQueryStringOptions(query)
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['quiz', queryStringOptions], () => fetchQuizData(queryStringOptions))
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function Quiz({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [queryError, setQueryError] = useState<{ isError: boolean; error: Error | null }>({
    isError: false,
    error: null,
  })

  // TODO: find rehydration error causes
  // https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  // https://traviswimer.com/blog/easily-fix-react-hydration-errors/
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }

  return (
    <>
      <div className={styles['bg-dots']}>
        <div className="mx-12">
          <div className="flex justify-center">
            <div className="card w-[75ch] min-w-0 bg-base-100 shadow-2xl">
              <main className="card-body">
                {queryError.isError ? (
                  <Error {...{ error: queryError.error }} />
                ) : (
                  <>
                    <OptionMenu />
                    <AssessmentSheet {...{ setQueryError }} />
                  </>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
