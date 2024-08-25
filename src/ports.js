import { merge, orderBy } from 'lodash-es'
import { rrcsMethods } from './methods.js'
//import { rrcsErrorCodes } from './errorcodes.js'

export function getAllCaps() {
	this.rrcsQueue.add(async () => {
		const ports = await this.rrcsMethodCall(rrcsMethods.status.getAllCaps.rpc, [])
		if (ports === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllCaps: \n${JSON.stringify(ports)}`)
		}
	})
}

export function getAllPorts() {
	this.rrcsQueue.add(async () => {
		const ports = await this.rrcsMethodCall(rrcsMethods.status.getAllPorts.rpc, [])
		if (ports === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllPorts: \n${JSON.stringify(ports)}`)
			this.log('info', `getAllPorts returned ${ports[1].length} elements`)
		}
		if (Array.isArray(ports[1])) {
			this.rrcs.ports = {}
			for (const port of ports[1]) {
				const newPort = { [`oid_${port.ObjectID}`]: port }
				this.rrcs.ports = merge(this.rrcs.ports, newPort)
			}
			this.buildPortChoices(ports[1])
		} else {
			this.low('warn', `Invalid response to getAllPorts. \n${JSON.stringify(ports)}`)
		}
	})
}

export function buildPortChoices(portArray) {
	if (!Array.isArray(portArray)) {
		this.log('warn', `buildPortChoices has been passed invalid data`)
		return undefined
	}
	this.rrcs.choices.ports.inputs = []
	this.rrcs.choices.ports.outputs = []
	this.rrcs.choices.ports.panels = []
	this.rrcs.choices.ports.all = []
	for (const port of portArray) {
		if (port.Input === true) {
			this.rrcs.choices.ports.inputs.push({ id: port.ObjectID, label: port.LongName })
		}
		if (port.Output === true) {
			this.rrcs.choices.ports.outputs.push({ id: port.ObjectID, label: port.LongName })
		}
		if (port.PortExType > 3 && port.KeyCount > 0) {
			this.rrcs.choices.ports.panels.push({ id: port.ObjectID, label: port.LongName })
		}
		this.rrcs.choices.ports.all.push({ id: port.ObjectID, label: port.LongName })
	}
	this.rrcs.choices.ports.inputs = orderBy(this.rrcs.choices.ports.inputs, ['label'], ['asc'])
	this.rrcs.choices.ports.outputs = orderBy(this.rrcs.choices.ports.outputs, ['label'], ['asc'])
	this.rrcs.choices.ports.panels = orderBy(this.rrcs.choices.ports.panels, ['label'], ['asc'])
	this.rrcs.choices.ports.all = orderBy(this.rrcs.choices.ports.all, ['label'], ['asc'])
	this.debounceUpdateActionFeedbackDefs()
}

export function getPortAddressFromObjectID(ObjectID) {
	if (this.rrcs.ports[`oid_${ObjectID}`] === undefined) {
		return undefined
	}
	const keys = Object.keys(this.rrcs.ports[`oid_${ObjectID}`])
	if (keys.includes('Net') && keys.includes('Node') && keys.includes('Port') && keys.includes('Input')) {
		return {
			net: this.rrcs.ports[`oid_${ObjectID}`].Net,
			node: this.rrcs.ports[`oid_${ObjectID}`].Node,
			port: this.rrcs.ports[`oid_${ObjectID}`].Port,
			isInput: this.rrcs.ports[`oid_${ObjectID}`].Input,
		}
	}
	return undefined
}
