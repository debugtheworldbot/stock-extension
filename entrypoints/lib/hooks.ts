import { useRef, useEffect } from 'react'

type IntervalFunction = () => unknown | void
export const useInterval = (
	callback: IntervalFunction,
	delay: number | null
) => {
	const savedCallback = useRef<IntervalFunction | null>(null)

	useEffect(() => {
		if (delay === null) return

		savedCallback.current = callback
	})

	useEffect(() => {
		if (delay === null) return
		function tick() {
			if (savedCallback.current !== null) {
				savedCallback.current()
			}
		}
		const id = setInterval(tick, delay)
		return () => {
			clearInterval(id)
		}
	}, [delay])
}

export const useStorageState = <T>(store: {
	key: string
	initialValue: T
}): [T, React.Dispatch<React.SetStateAction<T>>] => {
	const { key, initialValue } = store
	const [state, setState] = useState<T>(initialValue)

	useEffect(() => {
		const init = async () => {
			const value = await storage.getItem<T>(`local:${key}`)
			if (value) {
				setState(value)
			}
		}
		init()
	}, [key])
	storage.watch<T>(`local:${key}`, (newValue) => {
		if (newValue !== state && !!newValue) {
			setState(newValue)
		}
	})

	const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
		setState(value)
		storage.setItem(`local:${key}`, value)
	}

	return [state, setValue]
}
