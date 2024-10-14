import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
		permissions: ['storage', 'declarativeNetRequest'],
	},
	modules: ['@wxt-dev/module-react'],
})
