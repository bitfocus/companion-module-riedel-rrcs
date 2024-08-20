import { rrcsErrorCodes } from './errorcodes.js'

export async function setIOGain(address, method, gain) {
	const keys = Object.keys(address)
	const cleanGain = gain * 2 > 36 ? 36 : gain * 2 < -128 ? -128 : gain * 2 < -36 ? -36 : parseInt(gain * 2)
	if (isNaN(cleanGain)) {
		return undefined
	}
	if (keys.includes('net') && keys.includes('node') && keys.includes('port')) {
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(method, [address.net, address.node, address.port, cleanGain])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `setIOGain: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `setIOGain: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				return cleanGain
			}
		})
	}
}
