export default function Error({ error }: { error: Error }) {
  return (
    <>
      <h1>
        <b>{error?.message}</b>
      </h1>
    </>
  )
}
