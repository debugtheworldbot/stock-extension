import ReactDOM from 'react-dom/client'
import App from './App'
import '~/assets/main.css'

export default defineContentScript({
	matches: ['<all_urls>'],
	cssInjectionMode: 'ui',

	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: 'stock-ui',
			position: 'inline',
			onMount: (container) => {
				const app = document.createElement('div')
				app.id = 'stock-ui'
				app.style.fontSize = '16px'
				container.append(app)

				const root = ReactDOM.createRoot(app)
				root.render(<App />)
				return root
			},
			onRemove: (root) => {
				root?.unmount()
			},
		})

		browser.runtime.onMessage.addListener((message) => {
			if (message.action === 'onLoadComplete') {
				ui.mount()
			}
		})
	},
})
