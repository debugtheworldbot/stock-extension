import {
	codeListStore,
	FontSize,
	fontSizeStore,
	showUrlListStore,
} from '../lib/store'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import HelpDialog from './HelpDialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { getHTTPService, Market, Stock } from '../httpService'
import { useStorageState } from '../lib/hooks'
import { Switch } from './ui/switch'
import { getCurrentUrl } from '../lib/utils'

const { getHkValue, getShValue, getSzValue } = getHTTPService()
export default function Settings() {
	const [codeList, setCodeList] = useStorageState(codeListStore)
	const [showUrlList, setShowUrlList] = useStorageState(showUrlListStore)

	const [currentUrl, setCurrentUrl] = useState('')

	useEffect(() => {
		getCurrentUrl().then((url) => setCurrentUrl(url))
	}, [])

	const [pendingStock, setPendingStock] = useState<{
		sh: Stock | null
		sz: Stock | null
	}>({
		sh: null,
		sz: null,
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const target = e.target as HTMLFormElement
		const code = (target.elements[0] as HTMLInputElement).value
		const hk = (await getHkValue([code]))?.[0]
		const sh = (await getShValue([code]))?.[0]
		const sz = (await getSzValue([code]))?.[0]

		let type: Market | null = null

		if (code.length === 5 && hk) {
			type = 'hk'
		} else if (code.length === 6) {
			const existingShCode = codeList.find(
				(c) => c.code === code && c.type === 'sh'
			)
			const existingSzCode = codeList.find(
				(c) => c.code === code && c.type === 'sz'
			)

			if (existingShCode && existingSzCode) {
				return // Code already exists in both SH and SZ
			} else if (existingShCode) {
				type = 'sz'
			} else if (existingSzCode) {
				type = 'sh'
			} else if (sh && sz) {
				setPendingStock({ sh, sz })
				target.reset()
				return
			} else {
				type = sh ? 'sh' : sz ? 'sz' : null
			}
		} else {
			type = null // Invalid code length
		}

		if (!type) return
		if (codeList.some((c) => c.code === code && c.type === type)) return
		setCodeList([...codeList, { type, code }])
		target.reset()
	}

	return (
		<main className='flex flex-col gap-4 min-w-[380px] text-base'>
			<div className='flex items-center space-x-2 hover:underline'>
				<Switch
					onCheckedChange={(checked) => {
						if (checked) {
							setShowUrlList([...showUrlList, currentUrl])
						} else {
							setShowUrlList(showUrlList.filter((url) => url !== currentUrl))
						}
					}}
					checked={showUrlList.includes(currentUrl)}
					id='airplane-mode'
				/>
				<label htmlFor='airplane-mode' className='text-base cursor-pointer'>
					在此网页
					<span className='bg-gray-200 rounded p-1 mx-1'>{currentUrl}</span>
					下方展示股票信息
				</label>
			</div>
			<p className='text-sm text-gray-500'>
				也可以按快捷键
				<span className='bg-gray-200 rounded p-1 mx-1'> Ctrl + g </span>
				来快速切换是否在当前网页展示
			</p>
			<h1 className='text-xl font-bold'>添加股票</h1>
			<form onSubmit={handleSubmit} className='flex gap-2 flex-shrink-0'>
				<Input
					maxLength={6}
					minLength={5}
					required
					type='number'
					placeholder='A股/港股/场内基金代码'
					className='w-fit px-2 border rounded'
				/>
				<Button className='flex' variant='outline'>
					添加
				</Button>
			</form>
			{pendingStock.sh && (
				<Button
					className='hover:bg-green-400 rounded px-2 flex gap-1'
					onClick={() => {
						setCodeList([
							...codeList,
							{
								type: 'sh' as const,
								code: pendingStock.sh!.code,
							},
						])
						setPendingStock({
							sh: null,
							sz: null,
						})
					}}
				>
					<PlusCircledIcon />
					{pendingStock.sh!.name}
				</Button>
			)}
			{pendingStock.sz && (
				<Button
					className='hover:bg-green-400 rounded px-2 flex gap-1'
					onClick={() => {
						setCodeList([
							...codeList,
							{
								type: 'sz' as const,
								code: pendingStock.sz!.code,
							},
						])
						setPendingStock({
							sh: null,
							sz: null,
						})
					}}
				>
					<PlusCircledIcon />
					{pendingStock.sz!.name}
				</Button>
			)}

			<h1 className='text-xl font-bold'>设置</h1>
			<div className='flex gap-2 items-center'>
				{/* <NameSwitch /> */}
				<FontSizeSelect />
				<HelpDialog />
				<a
					className='ml-2 px-2 text-base'
					href='https://jinshuju.net/f/aDbpnC'
					target='_blank'
				>
					反馈
				</a>
			</div>
		</main>
	)
}

const FontSizeSelect = () => {
	const [fontSize, setFontSize] = useStorageState(fontSizeStore)
	return (
		<Select
			value={fontSize}
			onValueChange={(value) => setFontSize(value as FontSize)}
		>
			<SelectTrigger className='w-fit'>
				<SelectValue placeholder='字号' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='xs'>最小字号</SelectItem>
				<SelectItem value='sm'>小字号</SelectItem>
				<SelectItem value='base'>中字号</SelectItem>
				<SelectItem value='xl'>大字号</SelectItem>
			</SelectContent>
		</Select>
	)
}

// const NameSwitch = () => {
// 	const [showName, setShowName] = useAtom(showNameAtom)
// 	return (
// 		<Button
// 			variant='outline'
// 			className='flex items-center gap-1'
// 			onClick={() => setShowName(!showName)}
// 		>
// 			{showName ? <CodeIcon /> : <TextIcon />}
// 			显示股票{showName ? '代码' : '名称'}
// 		</Button>
// 	)
// }
