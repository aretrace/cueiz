import { useRouter } from 'next/router'
import { useState } from 'react'

import { QuizQueryStringOptions } from '../common/types'
import { ascertainQueryStringOptions, categoryOptions } from '../data/quiz-data'

export default function OptionMenu() {
  const router = useRouter()
  const queryStringOptions = ascertainQueryStringOptions(router.query)
  const { amount, category, difficulty } = queryStringOptions

  // TS 5 ?
  // <const T extends keyof QuizQueryStringOptions>
  function adjustQueryStringOptions<T extends keyof QuizQueryStringOptions>(
    queryOption: T,
    value: QuizQueryStringOptions[T]
  ) {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...queryStringOptions, [queryOption]: value },
      },
      undefined,
      { shallow: true }
    )
  }

  function amountHandler(e: React.ChangeEvent<HTMLInputElement>) {
    adjustQueryStringOptions('amount', parseInt(e.target.value as string))
  }

  function categoryHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    adjustQueryStringOptions('category', e.target.value)
  }

  // TODO: clean up logic for radio button selection
  const [selectedRadioValue, setSelectedRadioValue] = useState(difficulty)
  function difficultyHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedRadioValue(e.target.value)
    adjustQueryStringOptions('difficulty', e.target.value)
  }

  return (
    <>
      <form className="-mt-3 mb-3 flex items-center gap-8 overflow-x-auto">
        <div className="min-w-fit flex-1">
          <label className="label" htmlFor="amount">
            <span className="label-text text-lg">Number of questions</span>
          </label>
          <input
            className="range"
            type="range"
            min="1"
            max="5"
            value={amount}
            onChange={(e) => amountHandler(e)}
            name="amount"
            id="amount"
          />
          <div className="text-md flex w-full justify-between px-2">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
        <div className="form-control min-w-[16ch] flex-1">
          <label className="label" htmlFor="category">
            <span className="label-text text-lg">Category</span>
          </label>
          <select
            className="select-bordered select"
            value={category}
            onChange={(e) => categoryHandler(e)}
            name="category"
            id="category"
          >
            {Array.from(categoryOptions.entries()).map((categoryOption) => {
              const [name, id] = categoryOption
              return (
                <option key={id} value={name}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>
        <div className="basis-1/6">
          <div className="form-control">
            <label className="label cursor-pointer" htmlFor="easy">
              <span className="label-text mr-3 text-lg">Easy</span>
              <input
                type="radio"
                name="difficulty"
                className="radio checked:bg-green-400"
                value="easy"
                onChange={(e) => difficultyHandler(e)}
                id="easy"
                checked={'easy' == difficulty}
              />
            </label>
            <label className="label cursor-pointer" htmlFor="medium">
              <span className="label-text mr-3 text-lg">Medium</span>
              <input
                type="radio"
                name="difficulty"
                className="radio checked:bg-yellow-400"
                value="medium"
                onChange={(e) => difficultyHandler(e)}
                id="medium"
                checked={'medium' == difficulty}
              />
            </label>
            <label className="label cursor-pointer" htmlFor="hard">
              <span className="label-text mr-3 text-lg">Hard</span>
              <input
                type="radio"
                name="difficulty"
                className="radio checked:bg-red-400"
                value="hard"
                onChange={(e) => difficultyHandler(e)}
                id="hard"
                checked={'hard' == difficulty}
              />
            </label>
          </div>
        </div>
      </form>
    </>
  )
}
