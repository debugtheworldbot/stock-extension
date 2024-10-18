// 1. Import the style
import ReactDOM from 'react-dom/client'
import App from './App'
import '~/assets/main.css'

export default defineContentScript({
	matches: ['<all_urls>'],
	// 2. Set cssInjectionMode
	cssInjectionMode: 'ui',

	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: 'stock-ui',
			position: 'inline',
			onMount: (container) => {
				// Container is a body, and React warns when creating a root on the body, so create a wrapper div
				const app = document.createElement('div')
				app.id = 'stock-ui'
				app.style.fontSize = '16px'
				container.append(app)

				// Create a root on the UI container and render a component
				const root = ReactDOM.createRoot(app)
				root.render(<App />)
				return root
			},
			onRemove: (root) => {
				root?.unmount()
			},
		})

		if (document.readyState === 'complete') {
			ui.mount()
		}

		document.onreadystatechange = () => {
			if (document.readyState === 'complete') {
				ui.mount()
			}
		}
	},
})
