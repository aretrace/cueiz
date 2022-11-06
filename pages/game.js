import { useEffect, useState, useCallback, useMemo, memo, useRef, useInsertionEffect, useLayoutEffect } from 'react'
import { useEvent } from '../libs/useEvent-polyfill'
import styles from '../styles/background.module.css'
import axios from 'axios'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { default as IsLoadingWrapper } from '../components/conditional-wrapper'
import { useRouter } from 'next/router'
import { nanoid } from 'nanoid'
import ErrorScreen from '../components/error-screen'
import LoadingScreen from '../components/loading-screen'
import { shuffleArray, decodeHTMLEntities, randSplice } from '../libs/helpers'
import Question from '../components/question'

// TODO: solve if opentdb is down!
async function getCueiz() {
  const url = `https://opentdb.com/api.php?amount=4&category=18&difficulty=easy&type=multiple`
  try {
    // response.data
    const { data } = await axios.get(url)
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getServerSideProps(ctx) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['cueiz'], getCueiz)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function Game() {
  // https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
  // const router = useRouter()
  // function refreshData() {
  //   router.replace(router.asPath)
  // }

  const {
    isLoading,
    isError,
    data: cueizData,
    error,
    refetch,
  } = useQuery(['cueiz'], getCueiz, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: `0`,
    cacheTime: `0`,
    select(data) {
      data?.results.forEach((item) => {
        // item.isResponseCorrect = false
        item.question = decodeHTMLEntities(item.question).trim()
        item.correct_answer = decodeHTMLEntities(item.correct_answer).trim()
        item.incorrect_answers = item.incorrect_answers.map((incorrect_answer) =>
          decodeHTMLEntities(incorrect_answer).trim()
        )
      })
      return data
    },
  })

  // https://alexsidorenko.com/blog/react-list-rerender/
  // https://stackoverflow.com/questions/61263368/how-to-shuffle-an-array-once-in-functional-react-component
  const randAnsrArray = useMemo(
    () =>
      cueizData?.results.map((item) =>
        // return spliceAnswer(item.correct_answer, item.incorrect_answers)
        randSplice(item.incorrect_answers, item.correct_answer)
      ),
    [cueizData]
  )

  // const initState = new Array(cueizData?.results.length).fill(
  //   {
  //     question: '',
  //     isResponseCorrect: false,
  //   },
  //   0,
  //   4
  // )
  //console.log(initState)
  const [answersArray, setAnswersArray] = useState([
    ...new Array(cueizData?.results.length), // or randAnsArray, pass this value to via props to LoadingScreen!
  ]) /*
  [{
    question: '...',
    isResponseCorrect: false,
    selectedAnswer: 'q...,a...' // state variable
  }, {...}, ...]
  */

  function handleSelection(e, currentItem, qnListIndex, uniqButtonId, selectedAnswerParam) {
    // if (currentItem.question === 'todo') {
    // }
    // console.log(currentItem.correct_answer, e.target.innerHTML)

    // if (e.target.id === uniqButtonId) {
    //   alert(selectedAnswerParam)
    // }

    if (e.target.innerHTML == currentItem.correct_answer) {
      setAnswersArray((prevState) => {
        const newState = prevState.map((element, prticQnIndex) => {
          if (prticQnIndex === qnListIndex) {
            return { question: currentItem.question, isSelectionCorrect: true }
          }
          return element
        })
        return [...newState]
      })
    } else {
      // extract out as function
      setAnswersArray((prevState) => {
        const newState = prevState.map((element, prticQnIndex) => {
          if (prticQnIndex === qnListIndex) {
            return { question: currentItem.question, isSelectionCorrect: false }
          }
          return element
        })
        return [...newState]
      })
    }
  }

  // useEffect(() => {
  //   console.log(answersArray)
  // }, [answersArray])

  function handleSubmit(e) {
    e.preventDefault()
    //refreshData()
    refetch()
    // answers.every;;;
  }

  // https://github.com/vercel/next.js/discussions/38263
  // https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  // https://traviswimer.com/blog/easily-fix-react-hydration-errors/
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }

  let qnListLen = cueizData?.results.length

  return (
    <div className={styles['bg-dots'] + ' min-h-screen'}>
      <div
        className="grid place-items-center py-16"
        id="viewer"
        style={{ zoom: '80%' }} // TODO: change to tilwnd scale, for firefox's sake!
      >
        {isError ? (
          <ErrorScreen {...{ error }} />
        ) : (
          <div className="card w-1/2 bg-base-100 shadow-2xl  ">
            <IsLoadingWrapper condition={isLoading} wrapper={(children) => <LoadingScreen />}>
              <main className="card-body">
                {cueizData?.results.map((item, qnListIndex) => {
                  // const ansArray = spliceAnswer(
                  //   item.correct_answer,
                  //   item.incorrect_answers
                  // )
                  return (
                    // <div >
                    <Question
                      key={item.question} // key={nanoid()} makes button answer selection not work, why??
                      {...{ item, qnListIndex, randAnsrArray, handleSelection, qnListLen }}
                    />
                    // </div>
                  )
                })}
                <input
                  type="submit"
                  className="btn-primary no-animation btn-block btn"
                  onClick={(e) => handleSubmit(e)}
                />
                {/* disable durning (re)loading */}
              </main>
            </IsLoadingWrapper>
          </div>
        )}
        {/* JSON.stringify(cueizData, null, 2) */}
        {console.log(cueizData)}
      </div>
    </div>
  )
}
