import _ from 'lodash-es'
import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export function addGPO(gpo, state) {
	const GPoutput = {
		[`net_${gpo.net}`]: {
			[`node_${gpo.node}`]: {
				[`port_${gpo.port}`]: {
					[`slot_${gpo.slot}`]: {
						[`number_${gpo.number}`]: !!state,
					},
				},
			},
		},
	}
	this.rrcs.gpOutputs = _.merge(this.rrcs.gpOutputs, GPoutput)
	this.checkFeedbacks('gpoState')
}

export function addGPI(gpi, state) {
	const GPinput = {
		[`net_${gpi.net}`]: {
			[`node_${gpi.node}`]: {
				[`port_${gpi.port}`]: {
					[`slot_${gpi.slot}`]: {
						[`number_${gpi.number}`]: !!state,
					},
				},
			},
		},
	}
	this.rrcs.gpInputs = _.merge(this.rrcs.gpInputs, GPinput)
	this.checkFeedbacks('gpiState')
}

export function setGPOutput(gpo, state) {
	const keys = Object.keys(gpo)
	if (
		keys.includes('net') &&
		keys.includes('node') &&
		keys.includes('port') &&
		keys.includes('slot') &&
		keys.includes('number')
	) {
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.gpio.setGPO.rpc, [
				gpo.net,
				gpo.node,
				gpo.port,
				gpo.slot,
				gpo.number,
				!!state,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `setGPOutput: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `setGPOutput: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				this.addGPO(gpo, state)
			}
		})
	}
}

export function getGPOutput(gpo) {
	const keys = Object.keys(gpo)
	if (
		keys.includes('net') &&
		keys.includes('node') &&
		keys.includes('port') &&
		keys.includes('slot') &&
		keys.includes('number')
	) {
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.gpio.getGPO.rpc, [
				gpo.net,
				gpo.node,
				gpo.port,
				gpo.slot,
				gpo.number,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `getGPOutput: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `getGPOutput: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				this.addGPO(gpo, response[2])
			}
		})
	}
}

export function getGPInput(gpi) {
	const keys = Object.keys(gpi)
	if (
		keys.includes('net') &&
		keys.includes('node') &&
		keys.includes('port') &&
		keys.includes('slot') &&
		keys.includes('number')
	) {
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(rrcsMethods.gpio.getGPI.rpc, [
				gpi.net,
				gpi.node,
				gpi.port,
				gpi.slot,
				gpi.number,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `getGPInput: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				this.log('warn', `getGPInput: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			} else {
				this.addGPI(gpi, response[2])
			}
		})
	}
}
