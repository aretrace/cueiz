import { useState } from 'react'

export default function Question({ item, qnListIndex, randAnsrArray, handleSelection, qnListLen }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')

  return (
    <>
      <h2 className="card-title">
        {`${qnListIndex}:`} {item.question}
      </h2>
      <div className="py-1"></div>
      <div className="card-actions">
        <ButtonAns
          {...{
            item,
            randAnsrArray,
            handleSelection,
            qnListIndex,
            selectedAnswer,
            setSelectedAnswer,
          }}
        />
      </div>
      {qnListIndex < qnListLen - 1 ? <div className="divider mb-0"></div> : <div className="my-3"></div>}
    </>
  )
}

function ButtonAns({
  item: currentItem,
  randAnsrArray,
  handleSelection,
  qnListIndex,
  selectedAnswer,
  setSelectedAnswer,
}) {
  function handleSelectedAnswer(uniqButtonIdParam) {
    //if (...?) {
    setSelectedAnswer(uniqButtonIdParam)
    //}
  }

  // useEffect(() => {
  //   console.log(selectedAnswer)
  // }, [selectedAnswer])

  return randAnsrArray.map((equivQnPosn, ansrListIndex) => {
    // console.log(equivQnPosn, ansrListIndex)
    if (ansrListIndex === qnListIndex) {
      return equivQnPosn.map((particularAnsr, prticAnsrIndex) => {
        const uniqButtonId = `qn${qnListIndex}:ansr${prticAnsrIndex}`
        return (
          <button
            className={
              'btn-outline btn-sm btn shrink text-base hover:shadow-lg' +
              //(selectedAnswer === true ? ' bg-base-content text-base-100' : '') -- something like that
              (selectedAnswer === uniqButtonId ? ' bg-base-content text-base-100' : '')
            }
            type="button"
            key={uniqButtonId}
            id={uniqButtonId}
            onClick={(e) => {
              handleSelectedAnswer(uniqButtonId) // uniqButtonId
              handleSelection(e, currentItem, qnListIndex, uniqButtonId, selectedAnswer)
            }}
          >
            {/* <>{`${i}:`}</> */}
            {particularAnsr}:::{selectedAnswer}
          </button>
        )
      })
    }
  })
}
