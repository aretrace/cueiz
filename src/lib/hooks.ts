import { AllowedQueryParams } from '@/app/quiz/page'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

type AllPossibleQueryParams =
  keyof AllowedQueryParams /* & keyof SomeOtherExpectedQueryParams & keyof ... */

export function useQueryParams() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const getQueryParam = useCallback(
    (name: AllPossibleQueryParams, defaultValue: string) => {
      const value = searchParams.get(name)
      return value === null ? defaultValue : value
    },
    [searchParams]
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParam = useCallback(
    (name: string, value: string) => {
      const queryString = createQueryString(name, value)
      router.replace(`${pathname}?${queryString}`, { scroll: false })
    },
    [createQueryString]
  )

  return { getQueryParam, setQueryParam, queryParams: searchParams, createQueryString }
}
