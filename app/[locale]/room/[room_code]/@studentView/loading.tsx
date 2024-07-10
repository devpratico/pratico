import { Spinner } from "@radix-ui/themes"


export default function Loading() {
  return (
    <main style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
    </main>
  )
}