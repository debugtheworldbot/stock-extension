import { Market } from '~/entrypoints/lib/api'
import { atomWithStorage } from 'jotai/utils'

export const defaultCodeList: { type: Market; code: string }[] = [
	{ type: 'sh', code: '000001' },
	{ type: 'sh', code: '399001' },
	{ type: 'sh', code: '399006' },
	{ type: 'sh', code: '600519' },
	{ type: 'sh', code: '510300' },
	{ type: 'hk', code: '00700' },
]
export const codeListAtom = atomWithStorage<{ type: Market; code: string }[]>(
	'codeList',
	defaultCodeList
)

export const fontSizeAtom = atomWithStorage<'xs' | 'sm' | 'base' | 'xl'>(
	'fontSize',
	'base'
)

export const showSettingAtom = atomWithStorage<boolean>('showSetting', true)

export const showNameAtom = atomWithStorage<boolean>('showName', true)
