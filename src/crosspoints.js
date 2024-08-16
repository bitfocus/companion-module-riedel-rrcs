import _ from 'lodash-es'
import { limits } from './consts.js'

export function addCrosspoint(src, dst, state) {
	if (
		isNaN(src.net) ||
		isNaN(src.node) ||
		isNaN(src.port) ||
		isNaN(dst.net) ||
		isNaN(dst.node) ||
		isNaN(dst.port) ||
		state === undefined
	) {
		this.log('warn', `invalid crosspoint, can't add`)
		return undefined
	}
	const xpt = {
		[`src_net_${src.net}`]: {
			[`src_node_${src.node}`]: {
				[`src_port_${src.port}`]: {
					[`dst_net_${dst.net}`]: {
						[`dst_node_${dst.node}`]: {
							[`dst_port_${dst.port}`]: !!state,
						},
					},
				},
			},
		},
	}
	if (this.config.verbose) {
		this.log('debug', `adding crosspoint: ${JSON.stringify(xpt)}`)
	}
	this.rrcs.crosspoints = _.merge(this.rrcs.crosspoints, xpt)
	this.checkFeedbacks('crosspoint')
}

export function calcAddress(arg) {
	if (this.config.verbose) {
		this.log('debug', `calcAddress ${arg}`)
	}
	let address = arg.split('.')
	if (address.length !== 3) {
		return undefined
	}
	address = address.map((x) => parseInt(x))
	if (isNaN(address[0]) || isNaN(address[1]) || isNaN(address[2])) {
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
	return address
}
