import { merge, orderBy } from 'lodash-es'
import { rrcsMethods } from './methods.js'
//import { rrcsErrorCodes } from './errorcodes.js'

export async function getAllCaps() {
	return await this.rrcsQueue.add(async () => {
		const ports = await this.rrcsMethodCall(rrcsMethods.status.getAllCaps.rpc, [])
		if (ports === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllCaps: \n${JSON.stringify(ports)}`)
		}
		return ports
	})
}

export async function getAllPorts() {
	return await this.rrcsQueue.add(async () => {
		const ports = await this.rrcsMethodCall(rrcsMethods.status.getAllPorts.rpc, [])
		if (ports === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('info', `getAllPorts returned ${ports[1].length} ports`)
			this.log('debug', `getAllPorts: \n${JSON.stringify(ports)}`)
		}
		if (Array.isArray(ports[1])) {
			this.rrcs.ports = {}
			for (const port of ports[1]) {
				const newPort = { [`oid_${port.ObjectID}`]: port }
				this.rrcs.ports = merge(this.rrcs.ports, newPort)
			}
			this.buildPortChoices(ports[1])
			if (this.feedbacksToUpdate.includes('portDetails') === false) {
				this.feedbacksToUpdate.push('portDetails')
			}
		} else {
			this.low('warn', `Invalid response to getAllPorts. \n${JSON.stringify(ports)}`)
		}
		return ports
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
	this.rrcs.choices.ports.local.inputs = []
	this.rrcs.choices.ports.local.outputs = []
	this.rrcs.choices.ports.local.panels = []
	this.rrcs.choices.ports.local.all = []
	for (const port of portArray) {
		if (port.Input === true) {
			this.rrcs.choices.ports.inputs.push({ id: port.ObjectID, label: port.LongName })
			if (port.Net === this.rrcs.localPanel.net) {
				this.rrcs.choices.ports.local.inputs.push({ id: port.ObjectID, label: port.LongName })
			}
		}
		if (port.Output === true) {
			this.rrcs.choices.ports.outputs.push({ id: port.ObjectID, label: port.LongName })
			if (port.Net === this.rrcs.localPanel.net) {
				this.rrcs.choices.ports.local.outputs.push({ id: port.ObjectID, label: port.LongName })
			}
		}
		if (port.PortExType > 3 && port.KeyCount > 0) {
			this.rrcs.choices.ports.panels.push({ id: port.ObjectID, label: port.LongName })
			if (port.Net === this.rrcs.localPanel.net) {
				this.rrcs.choices.ports.local.panels.push({ id: port.ObjectID, label: port.LongName })
			}
		}
		this.rrcs.choices.ports.all.push({ id: port.ObjectID, label: port.LongName })
		if (port.Net === this.rrcs.localPanel.net) {
			this.rrcs.choices.ports.local.all.push({ id: port.ObjectID, label: port.LongName })
		}
	}
	this.rrcs.choices.ports.inputs = orderBy(this.rrcs.choices.ports.inputs, ['label'], ['asc'])
	this.rrcs.choices.ports.outputs = orderBy(this.rrcs.choices.ports.outputs, ['label'], ['asc'])
	this.rrcs.choices.ports.panels = orderBy(this.rrcs.choices.ports.panels, ['label'], ['asc'])
	this.rrcs.choices.ports.all = orderBy(this.rrcs.choices.ports.all, ['label'], ['asc'])

	this.rrcs.choices.ports.local.inputs = orderBy(this.rrcs.choices.ports.local.inputs, ['label'], ['asc'])
	this.rrcs.choices.ports.local.outputs = orderBy(this.rrcs.choices.ports.local.outputs, ['label'], ['asc'])
	this.rrcs.choices.ports.local.panels = orderBy(this.rrcs.choices.ports.local.panels, ['label'], ['asc'])
	this.rrcs.choices.ports.local.all = orderBy(this.rrcs.choices.ports.local.all, ['label'], ['asc'])
	this.debounceUpdateActionFeedbackDefs()
}

export function getPortAddressFromObjectID(ObjectID) {
	if (this.rrcs.ports[`oid_${ObjectID}`] === undefined) {
		return undefined
	}
	const keys = Object.keys(this.rrcs.ports[`oid_${ObjectID}`])
	if (keys.includes('Net') && keys.includes('Node') && keys.includes('Port') && keys.includes('Input')) {
		return {
			net: Number(this.rrcs.ports[`oid_${ObjectID}`].Net),
			node: Number(this.rrcs.ports[`oid_${ObjectID}`].Node),
			port: Number(this.rrcs.ports[`oid_${ObjectID}`].Port),
			isInput: !!this.rrcs.ports[`oid_${ObjectID}`].Input,
		}
	}
	return undefined
}

export function getPortDetailsFromObjectID(ObjectID) {
	if (this.rrcs.ports[`oid_${ObjectID}`] === undefined) {
		return undefined
	}
	const keys = Object.keys(this.rrcs.ports[`oid_${ObjectID}`])
	if (keys.includes('Net') && keys.includes('Node') && keys.includes('Port') && keys.includes('Input')) {
		return {
			net: Number(this.rrcs.ports[`oid_${ObjectID}`].Net),
			node: Number(this.rrcs.ports[`oid_${ObjectID}`].Node),
			port: Number(this.rrcs.ports[`oid_${ObjectID}`].Port),
			isInput: !!this.rrcs.ports[`oid_${ObjectID}`].Input,
			isOutput: !!this.rrcs.ports[`oid_${ObjectID}`].Output,
			label: this.rrcs.ports[`oid_${ObjectID}`].Label.toString(),
			longName: this.rrcs.ports[`oid_${ObjectID}`].LongName.toString(),
			type: this.rrcs.ports[`oid_${ObjectID}`].PortType.toString(),
			keyCount: Number(this.rrcs.ports[`oid_${ObjectID}`].KeyCount),
		}
	}
	return undefined
}
