import { AllowedQueryParams } from '@/app/quiz/page'
import { decodeHTMLEntities } from '@/lib/utils'
import { queryOptions } from '@tanstack/react-query'

const protoCategoryMap = [
  ['General Knowledge', 9],
  ['Entertainment: Books', 10],
  ['Entertainment: Film', 11],
  ['Entertainment: Music', 12],
  ['Entertainment: Musicals and Theatres', 13],
  ['Entertainment: Television', 14],
  ['Entertainment: Video Games', 15],
  ['Entertainment: Board Games', 16],
  ['Science and Nature', 17],
  ['Science: Computers', 18],
  ['Science: Mathematics', 19],
  ['Mythology', 20],
  ['Sports', 21],
  ['Geography', 22],
  ['History', 23],
  ['Politics', 24],
  ['Art', 25],
  ['Celebrities', 26],
  ['Animals', 27],
  ['Vehicles', 28],
  ['Entertainment: Comics', 29],
  ['Science: Gadgets', 30],
  ['Entertainment: Japanese Anime and Manga', 31],
  ['Entertainment: Cartoon and Animations', 32]
] as const

type FirstElementOfSubArray<T> = T extends readonly [infer First, ...any] ? First : never
export type CategoryName = FirstElementOfSubArray<(typeof protoCategoryMap)[number]>

export const categoryMap = new Map<CategoryName, number>(protoCategoryMap)

export async function getQuestions({ amount, category, difficulty }: AllowedQueryParams) {
  const categoryNumber = categoryMap.get(category)
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${categoryNumber}&difficulty=${difficulty}&type=multiple`
  )
  // TODO: Should 429 responses be handled here instead of in JSON data?
  return res.json()
}

// Used to fake the return data attribute of useQuery while
// fetching is in progress thus enabling the use of the data
// attribute in more places without having to worry about
// the data attribute being undefined
const placeholderData = {
  rateLimited: false,
  rawQuestions: [
    {
      question: '',
      correctAnswer: '',
      incorrectAnswers: ['', '', '']
    }
  ]
}
export type QuizData = typeof placeholderData

export function quizFetchOptions(queryParams: AllowedQueryParams) {
  return queryOptions({
    // https://tanstack.com/query/latest/docs/react/guides/query-keys#if-your-query-function-depends-on-a-variable-include-it-in-your-query-key
    // This is how automatic refetching works when query params change,
    // enabling refetching whenever form controls change!
    queryKey: ['questions', queryParams],
    queryFn: () => getQuestions(queryParams),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: 2,
    retryDelay: 6000,
    // placeholderData is used instead
    // of initialData because its not persisted
    // in React Query's cache
    placeholderData,
    select(rawData) {
      if (rawData.response_code === 5) {
        return {
          rateLimited: true,
          rawQuestions: placeholderData.rawQuestions
        } as QuizData
      }
      const decodedQuestions = rawData.results?.map(
        ({
          question,
          correct_answer,
          incorrect_answers
        }: {
          question: string
          correct_answer: string
          incorrect_answers: string[]
        }) => {
          return {
            question: decodeHTMLEntities(question),
            correctAnswer: decodeHTMLEntities(correct_answer),
            incorrectAnswers: incorrect_answers.map((answer: string) => decodeHTMLEntities(answer))
          }
        }
      )
      // Final data shape
      return {
        rateLimited: false,
        rawQuestions: decodedQuestions
      } as QuizData
    }
  })
}
