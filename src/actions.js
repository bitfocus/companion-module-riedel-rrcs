import { options } from './consts.js'
import { rrcsMethods } from './methods.js'

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
			self.rrcsQueue.add(() =>
				self.rrcsMethodCall(rrcsMethods.crosspoint.set.rpc, [src[0], src[1], src[2], dst[0], dst[1], dst[2]])
			)
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
	}
	self.setActionDefinitions(actionDefs)
}
