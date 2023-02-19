import styles from 'styles/quiz-background.module.css'
import { getServerSideProps } from '../pages/quiz'

// TODO: figure out how Nextjs layouts work
export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="card-body">{children}</main>
    </>
  )
}
