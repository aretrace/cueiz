'use client'
import { AllowedQueryParams } from '@/app/quiz/page'
import { categoryMap } from '@/data/quiz'
import { useQueryParams } from '@/lib/hooks'
import { useEffect, useState } from 'react'

export default function OptionsMenu({
  amount: defaultAmount,
  category: defaultCategory,
  difficulty: defaultDifficulty,
  isOptionsMenuDisabled,
  setOptionsMenuDisabled
}: AllowedQueryParams & {
  isFetching: boolean
  isOptionsMenuDisabled: boolean
  setOptionsMenuDisabled: (value: boolean) => void
}) {
  const { getQueryParam, setQueryParam } = useQueryParams()
  const currentDifficulty = getQueryParam('difficulty', defaultDifficulty)
  const optionsMenuDisableTime = 5 // seconds
  const [timeLeft, setTimeLeft] = useState(optionsMenuDisableTime)

  useEffect(() => {
    setTimeLeft(optionsMenuDisableTime)
    if (isOptionsMenuDisabled) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOptionsMenuDisabled])

  useEffect(() => {
    if (timeLeft === 0) {
      setOptionsMenuDisabled(false)
    }
  }, [timeLeft])

  return (
    <>
      <div
        className={`z-50 -mt-[1.3rem] flex justify-center ${
          isOptionsMenuDisabled ? '' : ' invisible'
        }`}
      >
        <a
          href="https://arc.net/l/quote/vsvahvqf"
          target="_blank"
          className="-mt-1 rounded-t-md bg-zinc-100 px-1 pb-1 text-xs text-slate-900 no-underline"
        >
          please wait <span className="text-red-600">{timeLeft > 0 && timeLeft} sec</span> to{' '}
          <i>change</i> quiz
        </a>
      </div>
      <form
        className={`-mt-5 mb-1 flex items-center gap-8 overflow-x-auto ${
          isOptionsMenuDisabled ? ' rounded-2xl bg-zinc-100 grayscale' : ''
        }`}
      >
        <fieldset
          className="contents"
          disabled={isOptionsMenuDisabled}
          onChange={() => setOptionsMenuDisabled(true)}
        >
          <div className="min-w-fit flex-1">
            <label className="label" htmlFor="amount">
              <span className="label-text text-lg">Number of questions</span>
            </label>
            <input
              className="range"
              type="range"
              min="1"
              max="5"
              defaultValue={getQueryParam('amount', defaultAmount.toString())}
              onChange={(e) => setQueryParam('amount', e.target.value)}
              name="amount"
              id="amount"
              list="values"
            />
            <datalist className="text-md flex w-full justify-between px-2" id="values">
              <option value="1" label="1"></option>
              <option value="2" label="2"></option>
              <option value="3" label="3"></option>
              <option value="4" label="4"></option>
              <option value="5" label="5"></option>
            </datalist>
          </div>
          <div className="form-control min-w-[16ch] flex-1">
            <label className="label" htmlFor="category">
              <span className="label-text text-lg">Category</span>
            </label>
            <select
              className="select select-bordered border-inherit"
              defaultValue={getQueryParam('category', defaultCategory)}
              onChange={(e) => setQueryParam('category', e.target.value)}
              name="category"
              id="category"
            >
              {Array.from(categoryMap.entries()).map((categoryOption) => {
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
                  onChange={(e) => setQueryParam('difficulty', e.target.value)}
                  id="easy"
                  defaultChecked={currentDifficulty === 'easy'}
                />
              </label>
              <label className="label cursor-pointer" htmlFor="medium">
                <span className="label-text mr-3 text-lg">Medium</span>
                <input
                  type="radio"
                  name="difficulty"
                  className="radio checked:bg-yellow-400"
                  value="medium"
                  onChange={(e) => setQueryParam('difficulty', e.target.value)}
                  id="medium"
                  defaultChecked={currentDifficulty === 'medium'}
                />
              </label>
              <label className="label cursor-pointer" htmlFor="hard">
                <span className="label-text mr-3 text-lg">Hard</span>
                <input
                  type="radio"
                  name="difficulty"
                  className="radio checked:bg-red-400"
                  value="hard"
                  onChange={(e) => setQueryParam('difficulty', e.target.value)}
                  id="hard"
                  defaultChecked={currentDifficulty === 'hard'}
                />
              </label>
            </div>
          </div>
        </fieldset>
      </form>
    </>
  )
}
