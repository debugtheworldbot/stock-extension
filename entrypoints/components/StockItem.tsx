import { DrawingPinIcon, TrashIcon } from '@radix-ui/react-icons'
import { useStorageState } from '../lib/hooks'
import { codeListStore } from '../lib/store'
import { Market, Stock } from '../httpService'

export const StockItem = ({ stock, type }: { stock: Stock; type: Market }) => {
	const [codeList, setCodeList] = useStorageState(codeListStore)
	return (
		<div
			className='relative group bg-transparent px-2 py-1 rounded transition-all flex-shrink-0 items-center'
			key={stock.name}
		>
			<div className='opacity-0 group-hover:opacity-100 transition-all absolute -top-2 right-0 flex gap-1'>
				<button
					onClick={() => {
						const index = codeList.findIndex(
							(c) => c.type === type && c.code === stock.code
						)
						if (index === -1) return
						const newCodeList = [
							...codeList.slice(0, index),
							...codeList.slice(index + 1),
						]
						newCodeList.unshift({ type, code: stock.code })
						setCodeList(newCodeList)
					}}
					className='transition-all border p-0.5 rounded hover:bg-green-300'
				>
					<DrawingPinIcon className='w-[1em] h-[1em]' />
				</button>
				<button
					onClick={() => {
						setCodeList(
							codeList.filter(
								(c) => !(c.type === type && c.code === stock.code)
							)
						)
					}}
					className='transition-all border p-0.5 rounded hover:bg-red-300'
				>
					<TrashIcon className='w-[1em] h-[1em]' />
				</button>
			</div>
			<span className='font-mono'>{stock.name}</span>
			<span className='font-mono'> {stock.current}</span>
			<span>{stock.percent >= 0 ? '△' : '▽'}</span>
			<span className='font-mono'>{stock.percent.toFixed(2)}%</span>
		</div>
	)
}
