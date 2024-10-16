import { Market } from '../httpService'

const defaultCodeList: CodeList = [
	{ type: 'sh', code: '000001' },
	{ type: 'sz', code: '399001' },
	{ type: 'sh', code: '600519' },
	{ type: 'sh', code: '510300' },
	{ type: 'hk', code: '00700' },
]

export type CodeList = { type: Market; code: string }[]

export type FontSize = 'base' | 'lg' | 'sm' | 'xs'

export const getCodeList = async () => {
	const codeList = await storage.getItem<CodeList>('local:codeList')
	return codeList || defaultCodeList
}

export const getFontSize = async () => {
	const fontSize = await storage.getItem<FontSize>('local:fontSize')
	return fontSize || 'base'
}

export const getShowUrlList = async () => {
	const showUrlList = await storage.getItem<string[]>('local:showUrlList')
	return showUrlList || []
}

export const codeListStore = {
	key: 'codeList',
	initialValue: defaultCodeList,
}

export const showUrlListStore = {
	key: 'showUrlList',
	initialValue: [] as string[],
}

export const fontSizeStore = {
	key: 'fontSize',
	initialValue: 'base' as FontSize,
}
