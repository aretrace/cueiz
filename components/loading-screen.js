import styles from '../styles/loading.module.css'

export default function Loading(props) {
  // TODO: use props.[cueizData.Thingy] for sizes!
  const totalQnSize = 4
  const ansrSize = 4
  const loadingDotsSize = 12

  // Should i use more traditional looping constructs, is this a GC problem??
  return (
    <div className="card-body">
      {[...Array(totalQnSize)].map((_, i) => (
        <>
          <h1 className="card-title text-2xl">
            ¿
            {[...Array(loadingDotsSize)].map((_, i) => (
              <span className={styles['loader__dot']}>.</span>
            ))}
            ?
          </h1>
          <div className="card-actions">
            {[...Array(ansrSize)].map((_, i) => (
              <button className={'btn-sm btn shrink'}>
                {[...Array(loadingDotsSize)].map((_, i) => (
                  <span className={styles['loader__dot']}>.</span>
                ))}
              </button>
            ))}
          </div>
        </>
      ))}
    </div>
  )
}
