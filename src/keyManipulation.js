import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export async function pressKey(address, isInput, page, expPanel, keyNumber, isVirtual, press, trigger, pool) {
	const keys = Object.keys(address)
	if (isNaN(page) || page < 0 || isNaN(expPanel) || expPanel < 0 || isNaN(keyNumber) || keyNumber < 1) {
		this.low('warn', ` invalid arguments supplied to pressKey`)
		return undefined
	}
	const poolPort = isNaN(parseInt(pool)) ? -1 : parseInt(pool) < -1 ? -1 : parseInt(pool) > 32 ? 32 : parseInt(pool)
	if (keys.includes('node') && keys.includes('port')) {
		return await this.rrcsQueue.add(async () => {
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
				poolPort,
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

export async function labelAndMarker(
	labelAndMarkerMethod,
	address,
	isInput,
	page,
	expPanel,
	keyNumber,
	isVirtual,
	label,
	marker,
) {
	const keys = Object.keys(address)
	if (isNaN(page) || page < 0 || isNaN(expPanel) || expPanel < 0 || isNaN(keyNumber) || keyNumber < 0) {
		this.low('warn', ` invalid arguments supplied to labelAndMarker`)
		return undefined
	}
	const cleanLabel = label.substring(0, 8)
	if (keys.includes('node') && keys.includes('port')) {
		let args = []
		switch (labelAndMarkerMethod) {
			case rrcsMethods.keyManipulations.clearKeyLabel.rpc:
			case rrcsMethods.keyManipulations.clearKeyLabelAndMarker.rpc:
			case rrcsMethods.keyManipulations.clearKeyMarker.rpc:
				args = [address.node, address.port, isInput, page, expPanel, keyNumber, isVirtual]
				break
			case rrcsMethods.keyManipulations.setKeyLabel.rpc:
				if (cleanLabel.length < 1) {
					this.log('warn', `label length must be between 1 & 8 characters ${cleanLabel}`)
					return undefined
				}
				args = [address.node, address.port, isInput, page, expPanel, keyNumber, isVirtual, cleanLabel]
				break
			case rrcsMethods.keyManipulations.setKeyLabelAndMarker.rpc:
				if (isNaN(marker) || marker < 1 || marker > 128 || cleanLabel.length < 1) {
					this.log('warn', `labelAndMarkerMethod invalid marker number ${marker} or label length ${cleanLabel}`)
					return undefined
				}
				args = [address.node, address.port, isInput, page, expPanel, keyNumber, isVirtual, cleanLabel, marker]
				break
			case rrcsMethods.keyManipulations.setKeyMarker.rpc:
				if (isNaN(marker) || marker < 1 || marker > 128) {
					this.log('warn', `labelAndMarkerMethod invalid marker number ${marker}`)
					return undefined
				}
				args = [address.node, address.port, isInput, page, expPanel, keyNumber, isVirtual, marker]
				break
			default:
				if (this.config.verbose) {
					this.log('debug', `invalid method supplied to labelAndMarker ${labelAndMarkerMethod}`)
				}
				return undefined
		}
		return await this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(labelAndMarkerMethod, args)
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `${labelAndMarkerMethod}: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `${labelAndMarkerMethod}: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			}
			return response
		})
	}
}

export async function lockKey(address, isInput, page, expPanel, keyNumber, isVirtual, lock, pool) {
	if (isNaN(page) || page < 0 || isNaN(expPanel) || expPanel < 0 || isNaN(keyNumber) || keyNumber < 0) {
		this.low('warn', ` invalid arguments supplied to lockKey`)
		return undefined
	}
	const keys = Object.keys(address)
	const poolPort = isNaN(parseInt(pool)) ? -1 : parseInt(pool) < -1 ? -1 : parseInt(pool) > 32 ? 32 : parseInt(pool)
	if (keys.includes('node') && keys.includes('port')) {
		return await this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.keyManipulations.lockKey.rpc, [
				address.node,
				address.port,
				!!isInput,
				page,
				expPanel,
				keyNumber,
				!!isVirtual,
				!!lock,
				poolPort,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `lockKey: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `lockKey: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				return response[2]
			}
		})
	}
}
