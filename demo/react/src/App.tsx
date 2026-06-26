import { Button } from './components/ui/button/index'

function App() {
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

export default App
