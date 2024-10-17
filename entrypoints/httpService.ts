import { defineProxyService } from '@webext-core/proxy-service'
import { readStream } from './lib/utils'

// 1. Define your service
class HTTPService {
	async getShValue(stockCodeList: string[]): Promise<Stock[]> {
		if (stockCodeList.length === 0) return []
		const idListStr = stockCodeList.map((code) => `1.${code}`).join(',')
		try {
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
					current:
						stock.f1 === 2
							? (stock.f2 / 100).toFixed(2)
							: (stock.f2 / 1000).toFixed(2),
					percent: (stock.f4 * 100) / stock.f18,
				})) || []
			)
		} catch (error) {
			console.log(error)
			return []
		}
	}
	async getSzValue(stockCodeList: string[]): Promise<Stock[]> {
		if (stockCodeList.length === 0) return []
		const idListStr = stockCodeList.map((code) => `0.${code}`).join(',')
		try {
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
					current:
						stock.f1 === 2
							? (stock.f2 / 100).toFixed(2)
							: (stock.f2 / 1000).toFixed(2),
					percent: (stock.f4 * 100) / stock.f18,
				})) || []
			)
		} catch (error) {
			console.log(error)
			return []
		}
	}

	async getStockValue(stockCodeList: string[]): Promise<Stock[]> {
		const sh = (await this.getShValue(stockCodeList)) || []
		const sz = (await this.getSzValue(stockCodeList)) || []
		const hk = (await this.getHkValue(stockCodeList)) || []
		return [...sh, ...sz, ...hk]
	}

	async getHkValue(stockCodeList: string[]): Promise<Stock[]> {
		if (stockCodeList.length === 0) return []

		const idListStr = stockCodeList.map((code) => `rt_hk${code}`).join(',')

		try {
			const res = await fetch(`https://hq.sinajs.cn/list=${idListStr}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const data = await readStream(res.body!)
			const stocks = convertToStockArray(data)
			return (
				stocks?.map((stock: Stock) => ({
					type: 'hk',
					name: stock.name,
					code: stock.code,
					current: parseFloat(stock.current).toFixed(2),
					percent: stock.percent,
				})) || []
			)
		} catch (error) {
			console.log(error)
			return []
		}
	}
}
export const [registerHTTPService, getHTTPService] = defineProxyService(
	'HTTPService',
	() => new HTTPService()
)

export default {}

const convertToStockArray = (rawData: string): Stock[] => {
	// var hq_str_rt_hk00700 = "TENCENT,腾讯控股,433.800,436.000,433.800,425.200,426.400,-9.600,-2.202,426.400,426.600,3113356037.015,7264318,32.008,0.000,482.400,257.972,2024/10/15,10:41:57,30|3,N|Y|Y,0.000|0.000|0.000,0|||0.000|0.000|0.000, |0,Y";
	// var hq_str_rt_hk01810 = "XIAOMI-W,小米集团－Ｗ,23.600,23.600,24.050,23.400,23.850,0.250,1.059,23.850,23.900,893724745.700,37607253,31.176,0.000,26.200,11.840,2024/10/15,10:41:57,30|3,N|Y|Y,0.000|0.000|0.000,0|||0.000|0.000|0.000, |0,Y";

	return rawData
		.trim()
		.split(';')
		.filter(Boolean)
		.map((s) => s.trim())
		.map((stockData) => {
			const [c, stockInfo] = stockData.split('=')
			// c= var hq_str_rt_hk01810
			const code = c.replace('var hq_str_rt_hk', '')
			const [, name, , , , , current, , percent] = stockInfo
				.replace(/"/g, '')
				.split(',')
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
	f1: number // 类型 2股票 3指数 ?
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
