import styles from './styles.module.css'

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles['bg-dots']} py-[28px] 2xl:py-[52px]`}>
      <div className="mx-12">
        <div className="flex justify-center">
          <div className="card w-[75ch] min-w-0 bg-base-100 shadow-2xl">
            <main className="card-body">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
