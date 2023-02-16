import { DOMParser } from '@xmldom/xmldom'

export function decodeHTMLEntities(string: string) {
  return new DOMParser().parseFromString(`<root>${string}</root>`, 'text/xml').documentElement.textContent
}

// Fisher–Yates-Durstenfeld shuffle, ty (ashleedawg && Laurens Holst)
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function randSplice<T, K>(array: T[], ...items: K[]) {
  let cArray = [...items, ...array]
  const rArray = shuffleArray(cArray)
  return rArray
}
