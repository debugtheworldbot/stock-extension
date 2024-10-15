import { registerHTTPService } from './httpService'

export default defineBackground(() => {
	browser.runtime.onMessage.addListener((message, sender) => {
		if (message.action === 'openPopup') {
			console.log('open popup')
			browser.action.openPopup()
		}
	})
	registerHTTPService()
	browser.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [1],
		addRules: [
			{
				id: 1,
				priority: 1,
				action: {
					type: 'modifyHeaders',
					requestHeaders: [
						{
							header: 'Referer',
							operation: 'set',
							value: 'https://stock.finance.sina.com.cn/hkstock',
						},
					],
				},
				condition: {
					urlFilter: 'https://hq.sinajs.cn/*',
					resourceTypes: [
						'main_frame',
						'sub_frame',
						'xmlhttprequest',
						'websocket',
					],
				},
			},
		],
	})
})
