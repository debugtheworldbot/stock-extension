import clsx from 'clsx'
import { useAtom } from 'jotai'
import { marketIsOpen } from './lib/utils'
import { getHTTPService, Stock } from './httpService'
import { useInterval, useStorageState } from './lib/hooks'
import { StockItem } from './components/StockItem'
import { CodeList, defaultCodeList } from './lib/store'

const { getHkValue, getShValue, getSzValue } = getHTTPService()
function App() {
	const [stockList, setStockList] = useState<Stock[]>([])

	const [codeList] = useStorageState('codeList', defaultCodeList)

	const [fontSize] = useStorageState('fontSize', 'base')

	const fetchStock = useCallback(async () => {
		const shCodes = codeList.filter((c) => c.type === 'sh').map((c) => c.code)
		const szCodes = codeList.filter((c) => c.type === 'sz').map((c) => c.code)
		const hkCodes = codeList.filter((c) => c.type === 'hk').map((c) => c.code)
		const [sh, sz, hk] = await Promise.all([
			getShValue(shCodes),
			getSzValue(szCodes),
			getHkValue(hkCodes),
		])
		const orderedStocks = codeList
			.map(({ type, code }) => {
				const stockList = type === 'sh' ? sh : type === 'sz' ? sz : hk
				return stockList.find((stock) => stock.code === code)
			})
			.filter(Boolean) as Stock[]
		setStockList(orderedStocks)
	}, [codeList])

	useEffect(() => {
		fetchStock()
	}, [fetchStock])

	useInterval(() => {
		if (!marketIsOpen()) return

		fetchStock()
	}, 3000)

	return (
		<footer
			className={clsx(
				`transition-all fixed bottom-0 bg-white/80 backdrop-blur flex w-screen pl-6 pb-2 items-center gap-2 overflow-visible flex-wrap`,
				`text-${fontSize}`
			)}
		>
			{stockList.map((stock, index) => (
				<StockItem key={index} stock={stock} type={stock.type} />
			))}
		</footer>
	)
}

export default App
