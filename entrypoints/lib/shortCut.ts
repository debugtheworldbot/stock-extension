const applyShortCutListener = (callback: () => void) => {
	const listener = (event: KeyboardEvent) => {
		if (event.ctrlKey && event.key === 'g') {
			callback()
		}
	}
	document.addEventListener('keydown', listener)
	return () => {
		document.removeEventListener('keydown', listener)
	}
}

export default applyShortCutListener
