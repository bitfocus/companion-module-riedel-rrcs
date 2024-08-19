import _ from 'lodash-es'
import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

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
		this.log('debug', `adding crosspoint: ${JSON.stringify(xpt)} ${state ? 'active' : 'inactive'}`)
	}
	this.rrcs.crosspoints = _.merge(this.rrcs.crosspoints, xpt)
	this.checkFeedbacks('crosspoint')
}

export function setXp(method, src, dst, prio) {
	const args =
		method === rrcsMethods.crosspoint.setPrio.rpc || method === rrcsMethods.crosspoint.setDestruct.rpc
			? [src.net, src.node, src.port, dst.net, dst.node, dst.port, prio]
			: [src.net, src.node, src.port, dst.net, dst.node, dst.port]
	this.rrcsQueue.add(async () => {
		const xp = await this.rrcsMethodCall(method, args)
		if (xp.length === 2 && xp[1] === 0) {
			if (method === rrcsMethods.crosspoint.kill.rpc) {
				//since its possible for kill to return true and a crosspoint still be active, check the xp state
				this.getXp(src, dst)
			} else {
				this.addCrosspoint(src, dst, true)
			}
		} else if (xp[1] !== undefined) {
			this.log('warn', `setXp callback: ${rrcsErrorCodes[xp[1]]} src: ${src} dst: ${dst}`)
		}
	})
}

export function getXp(src, dst) {
	this.rrcsQueue.add(async () => {
		const xp = await this.rrcsMethodCall(rrcsMethods.crosspoint.get.rpc, [
			src.net,
			src.node,
			src.port,
			dst.net,
			dst.node,
			dst.port,
		])
		if (xp === undefined) {
			return
		}
		if (xp.length === 3 && xp[1] === 0) {
			this.addCrosspoint(
				{ net: src.net, node: src.node, port: src.port },
				{ net: dst.net, node: dst.node, port: dst.port },
				xp[2]
			)
		} else if (xp[1] !== undefined) {
			this.log(
				'warn',
				`crosspoint subscribe: ${rrcsErrorCodes[xp[1]]} src: ${JSON.stringify(src)} dst: ${JSON.stringify(dst)}`
			)
		}
	})
}

export function getAllXp() {
	this.rrcsQueue.add(async () => {
		const xps = await this.rrcsMethodCall(rrcsMethods.crosspoint.getAllActive.rpc, [])
		if (xps === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllXP: \n${JSON.stringify(xps)}`)
		}
		if (xps[`ErrorCode`] !== 0) {
			this.log('warn', `getAllXp: ${rrcsErrorCodes[xps.ErrorCode]}`)
			return undefined
		}
		if (xps[`XP Count`] > 0) {
			for (let i = 1; i <= xps[`XP Count`]; i++) {
				const xp = xps[`XP#${i}`]
				if (Array.isArray(xp) && xp.length === 6) {
					this.addCrosspoint({ net: xp[0], node: xp[1], port: xp[2] }, { net: xp[3], node: xp[4], port: xp[5] }, true)
				}
			}
		}
	})
}
