import { options } from './consts.js'
import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export default async function (self) {
	let actionDefs = []
	actionDefs['setCrosspoint'] = {
		name: 'Set Crosspoint',
		options: [options.sourceVar, options.destVar],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			self.rrcsQueue.add(async () => {
				const xp = await self.rrcsMethodCall(rrcsMethods.crosspoint.set.rpc, [
					src[0],
					src[1],
					src[2],
					dst[0],
					dst[1],
					dst[2],
				])
				if (xp.length === 2 && xp[1] === 0) {
					self.addCrosspoint(
						{ net: src[0], node: src[1], port: src[2] },
						{ net: dst[0], node: dst[1], port: dst[2] },
						true
					)
				} else if (xp[1] !== undefined) {
					self.log('warn', `setCrosspoint callback: ${rrcsErrorCodes[xp[1]]} src: ${src} dst: ${dst}`)
				}
			})
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			this.getXp({ net: src[0], node: src[1], port: src[2] }, { net: dst[0], node: dst[1], port: dst[2] })
		},
	}
	actionDefs['setCrosspointPrio'] = {
		name: 'Set Crosspoint with Priority',
		options: [options.sourceVar, options.destVar, options.priority],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			self.rrcsQueue.add(() =>
				self.rrcsMethodCall(rrcsMethods.crosspoint.setPrio.rpc, [
					src[0],
					src[1],
					src[2],
					dst[0],
					dst[1],
					dst[2],
					options.priority,
				])
			)
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			this.getXp({ net: src[0], node: src[1], port: src[2] }, { net: dst[0], node: dst[1], port: dst[2] })
		},
	}
	actionDefs['setCrosspointDestruct'] = {
		name: 'Set Crosspoint - Destructive',
		options: [options.sourceVar, options.destVar, options.priority, options.destructXpInfo],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			self.rrcsQueue.add(() =>
				self.rrcsMethodCall(rrcsMethods.crosspoint.setDestruct.rpc, [
					src[0],
					src[1],
					src[2],
					dst[0],
					dst[1],
					dst[2],
					options.priority,
				])
			)
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			this.getXp({ net: src[0], node: src[1], port: src[2] }, { net: dst[0], node: dst[1], port: dst[2] })
		},
	}
	actionDefs['killCrosspoint'] = {
		name: 'Kill Crosspoint',
		options: [options.sourceVar, options.destVar],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			self.rrcsQueue.add(() =>
				self.rrcsMethodCall(rrcsMethods.crosspoint.kill.rpc, [src[0], src[1], src[2], dst[0], dst[1], dst[2]])
			)
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			this.getXp({ net: src[0], node: src[1], port: src[2] }, { net: dst[0], node: dst[1], port: dst[2] })
		},
	}
	self.setActionDefinitions(actionDefs)
}
