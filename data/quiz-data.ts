import { ParsedUrlQuery } from 'querystring';

import { QuizQueryStringOptions } from '../common/types';

export const categoryOptions = new Map([
  ['General Knowledge', 9],
  ['Entertainment: Books', 10],
  ['Entertainment: Film', 11],
  ['Entertainment: Music', 12],
  ['Entertainment: Musicals & Theatres', 13],
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
  ['Entertainment: Cartoon and Animations', 32],
])

export const difficultyOptions = ['easy', 'medium', 'hard']

export function getQueryStringOptions(query: ParsedUrlQuery) {
  // DEFAULTS
  let queryStringObject = {
    amount: 4,
    category: 'Science: Computers',
    difficulty: 'easy',
  }
  const isAmountDefined = query.amount !== undefined || query.amount !== ''
  const areMultipleAmountsDefined = Array.isArray(query.amount)
  const isAmountNumber = typeof parseInt(query.amount as string) === 'number'
  const isAmountInRange = parseInt(query.amount as string) >= 1 && parseInt(query.amount as string) <= 5
  if (isAmountDefined && !areMultipleAmountsDefined && isAmountNumber && isAmountInRange) {
    queryStringObject.amount = parseInt(query.amount as string)
  }
  const isCategoryDefined = query.category !== undefined || query.category !== ''
  const areMultipleCategoriesDefined = Array.isArray(query.category)
  const isCategoryValid = categoryOptions.has(query.category as string)
  if (isCategoryDefined && !areMultipleCategoriesDefined && isCategoryValid) {
    queryStringObject.category = query.category as string
  }
  const isDifficultyDefined = query.difficulty !== undefined || query.difficulty !== ''
  const areMultipleDifficultiesDefined = Array.isArray(query.difficulty)
  const isDifficultyValid = difficultyOptions.includes(query.difficulty as string)
  if (isDifficultyDefined && !areMultipleDifficultiesDefined && isDifficultyValid) {
    queryStringObject.difficulty = query.difficulty as string
  }
  return queryStringObject as QuizQueryStringOptions
}

export async function fetchQuiz({ amount, category, difficulty }: QuizQueryStringOptions) {
  const categoryId = categoryOptions.get(category)
  // eslint-disable-next-line max-len
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`
  const res = await fetch(url)
  return res.json()
}
