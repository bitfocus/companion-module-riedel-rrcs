import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export function getXp(src, dst) {
	self.rrcsQueue.add(async () => {
		const xp = await self.rrcsMethodCall(rrcsMethods.crosspoint.get.rpc, [
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
			self.addCrosspoint(
				{ net: src.net, node: src.node, port: src.port },
				{ net: dst.net, node: dst.node, port: dst.port },
				xp[2]
			)
		} else if (xp[1] !== undefined) {
			self.log(
				'warn',
				`crosspoint subscribe: ${rrcsErrorCodes[xp[1]]} src: ${JSON.stringify(src)} dst: ${JSON.stringify(dst)}`
			)
		}
	})
}
