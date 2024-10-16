import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
		permissions: [
			'storage',
			'declarativeNetRequest',
			'webRequest',
			'activeTab',
		],
		host_permissions: ['*://hq.sinajs.cn/*'],
	},
	modules: ['@wxt-dev/module-react'],
})
