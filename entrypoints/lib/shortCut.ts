const applyShortCutListener = (callback: () => void) => {
	const listener = (event: KeyboardEvent) => {
		if (event.ctrlKey && event.key === 'g') {
			callback()
		}
	}
	const controller = new AbortController()
	document.addEventListener('keydown', listener, { signal: controller.signal })
	return () => {
		controller.abort()
	}
}

export default applyShortCutListener
