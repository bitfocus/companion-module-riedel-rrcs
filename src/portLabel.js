import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export async function setPortLabel(address, isInput, label) {
	const keys = Object.keys(address)
	const cleanLabel = label.substring(0, 8)
	if (cleanLabel.length < 1) {
		this.log('warn', `label length must be between 1 & 8 characters ${cleanLabel}`)
		return undefined
	}
	if (keys.includes('node') && keys.includes('port')) {
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.portLabel.set.rpc, [
				address.node,
				address.port,
				cleanLabel,
				!!isInput,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `setPortLabel: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `setPortLabel: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				//if it was successfull update port entry
				this.rrcs.ports[`oid_${this.getObjectIDfromAddress(address, isInput)}`].Label = cleanLabel
				if (this.feedbacksToUpdate.includes('portDetails') === false) {
					this.feedbacksToUpdate.push('portDetails')
				}
				return cleanLabel
			}
		})
	}
}

export async function getLabel(address, isInput) {
	const keys = Object.keys(address)
	if (keys.includes('node') && keys.includes('port')) {
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.portLabel.get.rpc, [address.node, address.port, isInput])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `getLabel: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `getLabel: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				return response[2]
			}
		})
	} else {
		return undefined
	}
}
