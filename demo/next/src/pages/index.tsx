import { Button } from '@/components/ui/button/index'

export default function Home() {
  const test = () => {
    alert('Hello World')
  }

  return (
    <>
      <Button
          type="button"
          onClick={() => test()}
        >
          Click Me
        </Button>
    </>
  )
}
