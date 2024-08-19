import { options } from './consts.js'

export default async function (self) {
	let actionDefs = []
	actionDefs['setCrosspoint'] = {
		name: 'Set Crosspoint',
		options: [
			options.xpMethod,
			options.srcAddr,
			options.dstAddr,
			options.priority,
			options.destructXpInfo,
			options.killXpInfo,
		],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			self.setXp(options.xpMethod, src, dst, options.priority)
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setCrosspoint ${src} ${dst}`)
				}
				return false
			}
			self.getXp(src, dst)
		},
	}
	actionDefs['getAllCrosspoints'] = {
		name: 'Get Active Crosspoints',
		options: [],
		callback: async () => {
			self.getAllXp()
		},
	}

	self.setActionDefinitions(actionDefs)
}
