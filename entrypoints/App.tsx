import clsx from 'clsx'
import { Button } from './components/ui/button'

const fontSize = 'sm'
function App() {
	return (
		<footer
			className={clsx(
				`transition-all fixed bottom-0 bg-white/80 backdrop-blur flex w-screen pl-6 pb-2 items-center gap-2 overflow-visible flex-wrap`,
				`text-${fontSize}`
			)}
		>
			<h1 className='text-2xl font-bold text-red-500'>WXT + React</h1>
			<Button>Click me</Button>
		</footer>
	)
}

export default App
