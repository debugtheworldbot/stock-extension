import { DrawingPinIcon, TrashIcon } from '@radix-ui/react-icons'
import { useStorageState } from '../lib/hooks'
import { defaultCodeList } from '../lib/store'
import { Market, Stock } from '../httpService'

export const StockItem = ({ stock, type }: { stock: Stock; type: Market }) => {
	const [, setCodeList] = useStorageState('codeList', defaultCodeList)
	return (
		<div
			className='relative group bg-transparent px-2 py-1 rounded transition-all flex-shrink-0 items-center'
			key={stock.name}
		>
			<div className='opacity-0 group-hover:opacity-100 transition-all absolute -top-2 right-0 flex gap-1'>
				<button
					onClick={() => {
						setCodeList((c) => {
							const index = c.findIndex(
								(c) => c.type === type && c.code === stock.code
							)
							if (index === -1) return c
							const newCodeList = [...c.slice(0, index), ...c.slice(index + 1)]
							newCodeList.unshift({ type, code: stock.code })
							return newCodeList
						})
					}}
					className='transition-all border p-0.5 rounded bg-white hover:bg-green-100'
				>
					<DrawingPinIcon className='w-[1em] h-[1em]' />
				</button>
				<button
					onClick={() => {
						setCodeList((c) =>
							c.filter((c) => !(c.type === type && c.code === stock.code))
						)
					}}
					className='transition-all border p-0.5 rounded bg-white hover:bg-red-300'
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
