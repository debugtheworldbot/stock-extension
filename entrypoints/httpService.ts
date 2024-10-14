import { defineProxyService } from '@webext-core/proxy-service'
import { readStream } from './lib/utils'

// 1. Define your service
class HTTPService {
	async getShValue(stockCodeList: string[]): Promise<Stock[]> {
		if (stockCodeList.length === 0) return []
		const idListStr = stockCodeList.map((code) => `1.${code}`).join(',')
		const response = await fetch(
			`https://push2.eastmoney.com/api/qt/ulist.np/get?fields=f1,f14,f2,f12,f5,f18,f4&secids=${idListStr}`,
			{ method: 'GET' }
		)
		const data = await response.json()
		const stocks = data.data?.diff as StockValue[]
		return (
			stocks?.map((stock: StockValue) => ({
				type: 'sh',
				name: stock.f14,
				code: stock.f12,
				current: (stock.f2 / 100).toFixed(2),
				percent: (stock.f4 * 100) / stock.f18,
			})) || []
		)
	}
	async getSzValue(stockCodeList: string[]): Promise<Stock[]> {
		if (stockCodeList.length === 0) return []
		const idListStr = stockCodeList.map((code) => `0.${code}`).join(',')
		const response = await fetch(
			`https://push2.eastmoney.com/api/qt/ulist.np/get?fields=f1,f14,f2,f12,f5,f18,f4&secids=${idListStr}`,
			{ method: 'GET' }
		)
		const data = await response.json()
		const stocks = data.data?.diff as StockValue[]
		return (
			stocks?.map((stock: StockValue) => ({
				type: 'sz',
				name: stock.f14,
				code: stock.f12,
				current: (stock.f2 / 100).toFixed(2),
				percent: (stock.f4 * 100) / stock.f18,
			})) || []
		)
	}

	async getStockValue(stockCodeList: string[]): Promise<Stock[]> {
		const sh = (await this.getShValue(stockCodeList)) || []
		const sz = (await this.getSzValue(stockCodeList)) || []
		const hk = (await this.getHkValue(stockCodeList)) || []
		return [...sh, ...sz, ...hk]
	}

	async getHkValue(stockCodeList: string[]): Promise<Stock[]> {
		if (stockCodeList.length === 0) return []
		const idListStr = stockCodeList.map((code) => `s_hk${code}`).join(',')

		const response = await fetch(`https://qt.gtimg.cn/q=${idListStr}`, {
			method: 'GET',
		})
		const res = await readStream(response.body!)
		const stocks = convertToStockArray(res)
		return (
			stocks?.map((stock: Stock) => ({
				type: 'hk',
				name: stock.name,
				code: stock.code,
				current: parseFloat(stock.current).toFixed(2),
				percent: stock.percent,
			})) || []
		)
	}
}
export const [registerHTTPService, getHTTPService] = defineProxyService(
	'HTTPService',
	() => new HTTPService()
)

export default {}

const convertToStockArray = (rawData: string): Stock[] => {
	return rawData
		.trim()
		.split(';')
		.filter(Boolean)
		.map((stockData) => {
			const [, stockInfo] = stockData.split('=')
			const [, name, code, current, , percent] = stockInfo
				.replace(/"/g, '')
				.split('~')
			return {
				code,
				name,
				current,
				percent: parseFloat(percent),
				type: 'hk' as Market,
			}
		})
}

type StockValue = {
	f1: number
	f2: number // 现价
	f4: number // 股票涨跌
	f5: number // 成交量
	f12: string // 股票代码
	f14: string // 股票名称
	f18: number // 开盘价
	type: Market
}

export type Market = 'sh' | 'sz' | 'hk'

export type Stock = {
	code: string
	name: string
	current: string
	percent: number
	type: Market
}
