// ty https://github.com/esamattis/underscore.string/blob/master/escapeHTML.js
// https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript/39243641#39243641
// let htmlEntities = {
//   nbsp: ' ',
//   cent: '¢',
//   pound: '£',
//   yen: '¥',
//   euro: '€',
//   copy: '©',
//   reg: '®',
//   lt: '<',
//   gt: '>',
//   quot: '"',
//   amp: '&',
//   apos: "'",
// }

// export function decodeHTMLEntities(str) {
//   return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
//     let match
//     if (entityCode in htmlEntities) {
//       return htmlEntities[entityCode]
//     } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
//       return String.fromCharCode(parseInt(match[1], 16))
//     } else if ((match = entityCode.match(/^#(\d+)$/))) {
//       return String.fromCharCode(~~match[1])
//     } else {
//       return entity
//     }
//   })
// }

export function decodeHTMLEntities(string) {
  // TODO: ssr error thingy, use jsdom or node-html-parser
  return new DOMParser().parseFromString(string, 'text/html').documentElement.textContent
}

// Fisher–Yates-Durstenfeld shuffle, ty (ashleedawg && Laurens Holst)
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function randSplice(array, ...items) {
  let cArray = [...items, ...array]
  const rArray = shuffleArray(cArray)
  return rArray
}
