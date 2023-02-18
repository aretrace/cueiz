export default function Error({ error }: { error: Error }) {
  return (
    <>
      <h1 className="text-red-600">
        <b>{error?.message}</b>
      </h1>
    </>
  )
}
