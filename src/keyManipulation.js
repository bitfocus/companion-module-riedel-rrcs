import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export async function pressKey(address, isInput, page, expPanel, keyNumber, isVirtual, press, trigger, pool) {
	const keys = Object.keys(address)
	if (keys.includes('node') && keys.includes('port')) {
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.keyManipulations.pressKeyEx.rpc, [
				address.node,
				address.port,
				!!isInput,
				page,
				expPanel,
				keyNumber,
				!!isVirtual,
				!!press,
				trigger,
				pool,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `pressKey: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `pressKey: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				return response[2]
			}
		})
	}
}
