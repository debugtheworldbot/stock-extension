import clsx from 'clsx'
import { marketIsOpen } from './lib/utils'
import { getHTTPService, Stock } from './httpService'
import { useInterval, useStorageState } from './lib/hooks'
import { StockItem } from './components/StockItem'
import { codeListStore, fontSizeStore, showUrlListStore } from './lib/store'
import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from './components/ui/button'
import applyShortCutListener from './lib/shortCut'

const { getHkValue, getShValue, getSzValue } = getHTTPService()
function App() {
	const [stockList, setStockList] = useState<Stock[]>([])
	const [showUrlList, setShowUrlList] = useStorageState(showUrlListStore)
	const currentHost = window.location.hostname
	const isShow = showUrlList.includes(currentHost)

	const [codeList] = useStorageState(codeListStore)
	const [fontSize] = useStorageState(fontSizeStore)

	const fetchStock = useCallback(async () => {
		if (!isShow) return
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
	}, [codeList, isShow])

	useEffect(() => {
		fetchStock()
	}, [fetchStock])

	useInterval(
		() => {
			if (!marketIsOpen()) return

			fetchStock()
		},
		isShow ? 3000 : null
	)

	useEffect(() => {
		const unSub = applyShortCutListener(() => {
			setShowUrlList(
				isShow
					? showUrlList.filter((s) => s !== window.location.hostname)
					: [...showUrlList, window.location.hostname]
			)
		})
		return () => {
			unSub()
		}
	}, [showUrlList, isShow])

	if (!isShow) return null

	return (
		<footer
			className={clsx(
				`transition-all fixed z-[9999] bottom-0 bg-transparent backdrop-blur-3xl flex w-screen pl-6 pb-2 items-center gap-2 overflow-visible flex-wrap`,
				`text-${fontSize}`
			)}
		>
			{stockList.map((stock, index) => (
				<StockItem key={index} stock={stock} type={stock.type} />
			))}
			<Button
				variant='ghost'
				onClick={async () => {
					await storage.setItem<string>(
						`local:currentHost`,
						window.location.hostname
					)
					await browser.runtime.sendMessage({
						action: 'openPopup',
						type: 'add',
						timestamp: 1,
					})
				}}
				size='icon'
			>
				<PlusIcon className='w-4 h-4' />
			</Button>
		</footer>
	)
}

export default App
