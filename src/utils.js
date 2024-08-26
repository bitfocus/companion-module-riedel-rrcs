import { limits } from './consts.js'

export function returnTransKey() {
	if (this.transKey === undefined || this.transKey >= 9999999999) {
		this.transKey = 0
	} else {
		this.transKey = this.transKey + 1
	}
	return 'C' + this.transKey.toString().padStart(10, '0')
}

export function calcAddress(arg) {
	try {
		if (this.config.verbose) {
			this.log('debug', `calcAddress ${arg}`)
		}
		const address = arg.split('.').map((x) => parseInt(x))
		if (address.length !== 3 || isNaN(address[0]) || isNaN(address[1]) || isNaN(address[2])) {
			return undefined
		}
		if (address[0] === 0 && address[1] === 0 && address[2] === 0) {
			//ok
		} else if (
			address[0] < limits.net.min ||
			address[0] > limits.net.max ||
			address[1] < limits.node.min ||
			address[1] > limits.node.max ||
			address[2] < limits.port.min ||
			address[2] > limits.port.max
		) {
			return undefined
		}
		return { net: address[0], node: address[1], port: address[2] - 1 }
	} catch {
		return undefined
	}
}

export function calcPortAddress(arg) {
	try {
		if (this.config.verbose) {
			this.log('debug', `calcPortAddress ${arg}`)
		}
		const address = arg.split('.').map((x) => parseInt(x))
		if (address.length < 2 || address.length > 3 || isNaN(address[0]) || isNaN(address[1])) {
			return undefined
		}
		if (address.length === 3) {
			// if address has been supplied in <net>.<node>.<port> format drop the net
			address.shift()
		}
		if (
			address[0] < limits.node.min ||
			address[0] > limits.node.max ||
			address[1] < limits.port.min ||
			address[1] > limits.port.max
		) {
			return undefined
		}
		return { node: address[0], port: address[1] - 1 }
	} catch {
		return undefined
	}
}

export function calcGpioAddress(arg) {
	try {
		if (this.config.verbose) {
			this.log('debug', `calcGpioAddress ${arg}`)
		}
		const address = arg.split('.').map((x) => parseInt(x))
		if (
			address.length !== 5 ||
			isNaN(address[0]) ||
			isNaN(address[1]) ||
			isNaN(address[2]) ||
			isNaN(address[3]) ||
			isNaN(address[4]) ||
			address[0] < limits.net.min ||
			address[0] > limits.net.max ||
			address[1] < limits.node.min ||
			address[1] > limits.node.max ||
			address[2] < limits.port.min ||
			address[2] > limits.port.max ||
			address[3] < 0 ||
			address[3] > limits.clientCardSlot.max ||
			address[4] < 1 ||
			address[4] > 256
		) {
			return undefined
		}
		return { net: address[0], node: address[1], port: address[2] - 1, slot: address[3], number: address[4] - 1 }
	} catch {
		return undefined
	}
}

export function calcGpioSlotNumber(arg) {
	if (this.config.verbose) {
		this.log('debug', `calcGpioSlotNumber ${arg}`)
	}
	const address = arg.split('.').map((x) => parseInt(x))
	if (
		address.length !== 2 ||
		isNaN(address[0]) ||
		isNaN(address[1]) ||
		address[0] < 0 ||
		address[0] > limits.clientCardSlot.max ||
		address[1] < 1 ||
		address[1] > 256
	) {
		return undefined
	}
	return { slot: address[0], number: address[1] - 1 }
}

export function getObjectIDfromAddress(addr) {
	try {
		for (const oid in this.rrcs.ports) {
			if (
				this.rrcs.ports[oid].Net === addr.net &&
				this.rrcs.ports[oid].Node === addr.node &&
				this.rrcs.ports[oid].Port === addr.port
			) {
				return this.rrcs.ports[oid].ObjectID
			}
		}
	} catch (e) {
		return undefined
	}
	return undefined
}
