import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export async function setAlias(address, isInput, alias) {
	const keys = Object.keys(address)
	const cleanAlias = alias.substring(0, 8)
	if (cleanAlias.length < 1) {
		this.log('warn', `alias length must be between 1 & 8 characters ${cleanAlias}`)
		return undefined
	}
	if (keys.includes('net') && keys.includes('node') && keys.includes('port')) {
		return await this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.portAlias.set.rpc, [
				address.net,
				address.node,
				address.port,
				cleanAlias,
				!!isInput,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `setAlias: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `setAlias: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				return cleanAlias
			}
		})
	}
}

export async function getAlias(address, isInput) {
	const keys = Object.keys(address)
	if (keys.includes('net') && keys.includes('node') && keys.includes('port')) {
		return await this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.portAlias.get.rpc, [
				address.net,
				address.node,
				address.port,
				isInput,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `setAlias: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `setAlias: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				return response[2]
			}
		})
	} else {
		return undefined
	}
}
