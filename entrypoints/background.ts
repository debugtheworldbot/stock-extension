import { registerHTTPService } from './httpService'

export default defineBackground(() => {
	registerHTTPService()
})
