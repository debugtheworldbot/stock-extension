import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
		permissions: ['storage', 'declarativeNetRequest', 'tabs', 'webRequest'],
		host_permissions: ['*://hq.sinajs.cn/*'],
		language: 'zh_CN',
	},
	modules: ['@wxt-dev/module-react'],
})
