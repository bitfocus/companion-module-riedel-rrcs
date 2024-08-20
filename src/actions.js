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
	actionDefs['getAllLogicSources'] = {
		name: 'Get All Logic Sources',
		options: [],
		callback: async () => {
			self.getAllLogicSources()
		},
	}

	if (self.rrcs.choices.logicSources.length > 0) {
		actionDefs['setLogicSource'] = {
			name: 'Set Logic Source',
			options: [
				{
					...options.logicSrc,
					choices: self.rrcs.choices.logicSources,
					default: self.rrcs.choices.logicSources[0].id,
				},
				options.logicState,
			],
			callback: async ({ options }, context) => {
				const src = parseInt(await context.parseVariablesInString(options.logicSrc))
				if (isNaN(src)) {
					if (self.config.verbose) {
						self.log('debug', `invalid variables supplied to set logic source ${src}`)
					}
					return undefined
				}
				self.setLogicSource(src, options.logicState)
			},
		}
	}
	actionDefs['setGPOutput'] = {
		name: 'Set GP Output',
		options: [options.gpOutputAdder, options.gpoState],
		callback: async ({ options }, context) => {
			const gpo = self.calcGpioAddress(await context.parseVariablesInString(options.gpo))
			if (gpo === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setGPOutput ${gpo}`)
				}
				return false
			}
			self.setGPOutput(gpo, options.gpoState)
		},
		subscribe: async ({ options }, context) => {
			const gpo = self.calcGpioAddress(await context.parseVariablesInString(options.gpo))
			if (gpo === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to setGPOutput subscribe ${options.gpo}`)
				}
				return false
			}
			self.getGPOutput(gpo)
		},
	}
	actionDefs['setAlias'] = {
		name: 'Set Port Alias',
		options: [options.addr, options.isInput, options.alias],
		callback: async ({ options }, context) => {
			const addr = self.calcAddress(await context.parseVariablesInString(options.addr))
			const alias = await context.parseVariablesInString(options.alias)
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setAlias ${options.addr}`)
				}
				return false
			}
			self.setAlias(addr, options.isInput, alias)
		},
	}
	actionDefs['setPortLabel'] = {
		name: 'Set Port Label',
		options: [options.addr, options.isInput, options.portLabel],
		callback: async ({ options }, context) => {
			const addr = self.calcAddress(await context.parseVariablesInString(options.addr))
			const label = await context.parseVariablesInString(options.portLabel)
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setAlias ${options.addr}`)
				}
				return false
			}
			self.setPortLabel(addr, options.isInput, label)
		},
	}
	self.setActionDefinitions(actionDefs)
}
