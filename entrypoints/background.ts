import { registerHTTPService } from './httpService'

export default defineBackground(() => {
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
					urlFilter: 'https://*',
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
