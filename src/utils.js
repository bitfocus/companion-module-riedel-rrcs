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
	if (this.config.verbose) {
		this.log('debug', `calcAddress ${arg}`)
	}
	let address = arg.split('.').map((x) => parseInt(x))
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
	return { net: address[0], node: address[1], port: address[2] }
}
