export default function ErrorScreen({ error }) {
  return (
    <h1>
      <b>{error?.message}</b>
    </h1>
  )
}
