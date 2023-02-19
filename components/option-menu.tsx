/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

import { QuizQueryStringOptions } from '../common/types'
import { categoryOptions, getQueryStringOptions } from '../data/quiz-data'

export default function OptionMenu({ queryStringOptions }: { queryStringOptions: QuizQueryStringOptions }) {
  // export default function OptionMenu() {
  const router = useRouter()
  const [form, setForm] = useState<QuizQueryStringOptions>(queryStringOptions)
  useEffect(
    function syncQueryStringWithForm() {
      if (!router.isReady) return
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, ...form },
      })
    },
    [router.isReady, form]
  )

  function amountHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, amount: parseInt(e.target.value as string) }))
  }

  function categoryHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, category: e.target.value }))
  }

  const [selectedRadioValue, setSelectedRadioValue] = useState(queryStringOptions.difficulty)
  function difficultyHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedRadioValue(e.target.value)
    setForm((prev) => ({ ...prev, difficulty: e.target.value }))
  }

  const { amount, category, difficulty } = queryStringOptions

  return (
    <>
      <form className="-mt-3 mb-3 flex items-center gap-8 overflow-x-auto">
        <div className="flex-1 min-w-fit">
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
        <div className="flex-1 form-control min-w-[16ch]">
          {/* <div className="form-control min-w-0"> */}
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
          {/* </div> */}
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
                defaultChecked={'easy' == difficulty}
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
                defaultChecked={'medium' == difficulty}
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
                defaultChecked={'hard' == difficulty}
              />
            </label>
          </div>
        </div>
      </form>
    </>
  )
}