import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function marketIsOpen() {
	const hour = new Date().getUTCHours()
	const beijingHour = hour + 8
	return beijingHour >= 9 && beijingHour <= 17
}

export async function readStream(stream: ReadableStream) {
	const reader = stream.getReader()
	const decoder = new TextDecoder('gbk') // 使用 UTF-8 解码器

	let result = ''
	let done = false

	while (!done) {
		// 读取流中的字节块
		const { value, done: readerDone } = await reader.read()
		done = readerDone

		// 如果读取到了数据块，使用 decoder 将其转换为字符串
		if (value) {
			result += decoder.decode(value, { stream: true })
		}
	}

	// 完成所有块的读取后，调用 `decoder.decode()` 结束流
	result += decoder.decode()

	return result
}

export async function getCurrentUrl(): Promise<string> {
	return new Promise((resolve) => {
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			// 获取当前标签页的URL
			let currentTab = tabs[0]
			let url = currentTab.url ? new URL(currentTab.url).hostname : ''
			console.log(url)

			resolve(url || '')
		})
	})
}
