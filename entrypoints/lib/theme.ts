export const detectTheme = (): 'dark' | 'light' => {
	// 获取 body 元素
	const bodyElement = document.body

	// 获取 body 元素的背景色和字体颜色
	const bodyStyles = window.getComputedStyle(bodyElement)
	const backgroundColor = bodyStyles.backgroundColor

	// 简单判断背景色是否是暗色
	function isDarkMode(backgroundColor: string) {
		// 提取 RGB 值
		const rgb = backgroundColor.match(/\d+/g)?.map(Number)
		if (!rgb) return false
		// 转换成相对亮度
		const luminance =
			(0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255

		// 亮度值低于 0.5 视为暗色模式
		return luminance < 0.5
	}

	if (isDarkMode(backgroundColor)) {
		return 'dark'
	}
	return 'light'
}
