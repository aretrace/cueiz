import Head from 'next/head'
import styles from '../../styles/background.module.css'

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles['bg-dots']}>
        <div className="grid scale-90 place-items-center py-16">
          <div className="card w-1/2 bg-base-100 shadow-2xl ">
            <main className="card-body">{children}</main>
          </div>
        </div>
      </div>
    </>
  )
}
