import { options } from './consts.js'
import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

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
				return undefined
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
				return undefined
			}
			self.getXp(src, dst)
		},
	}
	actionDefs['setXPVolume'] = {
		name: 'Set Crosspoint Volume',
		options: [options.srcAddr, options.dstAddr, options.conf, options.xpVolume],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			const volume = Number(await context.parseVariablesInString(options.xpVolume))
			if (src === undefined || dst === undefined || isNaN(volume)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid arguments supplied to setCrosspoint volume  ${options.srcAddr} ${options.dstAddr} ${options.xpVolume}`
					)
				}
				return undefined
			}
			self.setXPVolume(src, dst, !options.conf, options.conf, volume)
		},
		learn: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setCrosspoint volume  ${options.srcAddr} ${options.dstAddr}`)
				}
				return undefined
			}
			const response = await self.rrcsMethodCall(rrcsMethods.volume.getXp.rpc, [
				src.net,
				src.node,
				src.port,
				dst.net,
				dst.node,
				dst.port,
			])
			if (response === undefined) {
				return undefined
			}
			if (self.config.verbose) {
				self.log('debug', `setXPVolume learn: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				self.log('warn', `setXPVolume learn: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			}
			const volume = options.conf ? (response[3] - 230) / 2 : (response[2] - 230) / 2
			return {
				...options,
				xpVolume: volume,
			}
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
				return undefined
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
		learn: async ({ options }, context) => {
			const addr = self.calcAddress(await context.parseVariablesInString(options.addr))
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setAlias ${options.addr}`)
				}
				return undefined
			}
			const response = await self.rrcsMethodCall(rrcsMethods.portAlias.get.rpc, [
				addr.net,
				addr.node,
				addr.port,
				options.isInput,
			])
			if (response === undefined) {
				return undefined
			}
			if (self.config.verbose) {
				self.log('debug', `setAlias learn: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				self.log('warn', `setAlias learn: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			}
			return {
				...options,
				alias: response[2],
			}
		},
	}
	actionDefs['setPortLabel'] = {
		name: 'Set Port Label',
		options: [options.portAddr, options.isInput, options.portLabel],
		callback: async ({ options }, context) => {
			const addr = self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const label = await context.parseVariablesInString(options.portLabel)
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setPortLabel ${options.portAddr}`)
				}
				return false
			}
			self.setPortLabel(addr, options.isInput, label)
		},
		learn: async ({ options }, context) => {
			const addr = self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setPortLabel ${options.portAddr}`)
				}
				return undefined
			}
			const response = await self.rrcsMethodCall(rrcsMethods.portLabel.get.rpc, [addr.node, addr.port, options.isInput])
			if (response === undefined) {
				return undefined
			}
			if (self.config.verbose) {
				self.log('debug', `setPortLabel learn: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				self.log('warn', `setPortLabel learn: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			}
			return {
				...options,
				portLabel: response[2],
			}
		},
	}

	actionDefs['setIOGain'] = {
		name: 'Set IO Gain',
		options: [options.ioMethod, options.addr, options.ioGain, options.ioGainInfo],
		callback: async ({ options }, context) => {
			const addr = self.calcAddress(await context.parseVariablesInString(options.addr))
			const gain = Number(await context.parseVariablesInString(options.ioGain))
			if (addr === undefined || isNaN(gain)) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setIOGain ${options.addr} ${options.gain}`)
				}
				return false
			}
			self.setIOGain(addr, options.ioMethod, gain)
		},
		learn: async ({ options }, context) => {
			const addr = self.calcAddress(await context.parseVariablesInString(options.addr))
			const method = options.ioMethod.replace('Set', 'Get')
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setIOGain ${options.portAddr}`)
				}
				return undefined
			}
			const response = await self.rrcsMethodCall(method, [addr.net, addr.node, addr.port])
			if (response === undefined) {
				return undefined
			}
			if (self.config.verbose) {
				self.log('debug', `setIOGain learn: \n${JSON.stringify(response)}`)
			}
			if (response[1] !== 0) {
				self.log('warn', `setIOGain learn: ${rrcsErrorCodes[response[1]]}`)
				return undefined
			}
			const gain = response[2] <= -128 ? -128 : response[2] / 2
			return {
				...options,
				ioGain: gain,
			}
		},
	}
	actionDefs['keyPress'] = {
		name: 'Key - Press',
		options: [
			options.portAddr,
			options.isInput,
			options.page,
			options.expPanel,
			options.keyNumber,
			options.isVirtual,
			options.press,
			options.trigger,
			options.poolPort,
			options.triggerInfo,
		],
		callback: async ({ options }, context) => {
			const addr = self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const page = parseInt(await context.parseVariablesInString(options.page))
			const expPanel = parseInt(await context.parseVariablesInString(options.expPanel))
			const key = parseInt(await context.parseVariablesInString(options.keyNumber))
			const pool = parseInt(await context.parseVariablesInString(options.poolPort))
			if (addr === undefined || isNaN(page) || isNaN(expPanel) || isNaN(key) || isNaN(pool)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid args supplied to pressKey ${options.portAddr} ${options.page} ${options.expPanel} ${options.keyNumber} ${options.poolPort}`
					)
				}
				return undefined
			}
			self.pressKey(addr, options.isInput, page, expPanel, key, options.isVirtual, options.press, options.trigger, pool)
		},
	}
	actionDefs['keyLock'] = {
		name: 'Key - Lock',
		options: [
			options.portAddr,
			options.isInput,
			options.page,
			options.expPanel,
			options.keyNumber,
			options.isVirtual,
			options.keyLock,
			options.poolPort,
		],
		callback: async ({ options }, context) => {
			const addr = self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const page = parseInt(await context.parseVariablesInString(options.page))
			const expPanel = parseInt(await context.parseVariablesInString(options.expPanel))
			const key = parseInt(await context.parseVariablesInString(options.keyNumber))
			const pool = parseInt(await context.parseVariablesInString(options.poolPort))
			if (addr === undefined || isNaN(page) || isNaN(expPanel) || isNaN(key) || isNaN(pool)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid args supplied to keyLock ${options.portAddr} ${options.page} ${options.expPanel} ${options.keyNumber} ${options.poolPort}`
					)
				}
				return undefined
			}
			self.lockKey(addr, options.isInput, page, expPanel, key, options.isVirtual, options.lock, pool)
		},
	}

	actionDefs['keyLabelAndMarker'] = {
		name: 'Key - Label & Marker',
		options: [
			options.labelAndMarkerMethod,
			options.portAddr,
			options.isInput,
			options.page,
			options.expPanel,
			options.keyNumber,
			options.isVirtual,
			options.keyLabel,
			options.keyMarker,
		],
		callback: async ({ options }, context) => {
			const addr = self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const page = parseInt(await context.parseVariablesInString(options.page))
			const expPanel = parseInt(await context.parseVariablesInString(options.expPanel))
			const key = parseInt(await context.parseVariablesInString(options.keyNumber))
			const label = await context.parseVariablesInString(options.keyLabel)
			const marker = parseInt(await context.parseVariablesInString(options.keyMarker))
			if (addr === undefined || isNaN(page) || isNaN(expPanel) || isNaN(key) || isNaN(marker)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid args supplied to pressKey ${options.portAddr} ${options.page} ${options.expPanel} ${options.keyNumber} ${options.keyMarker}`
					)
				}
				return undefined
			}
			self.labelAndMarker(
				options.labelAndMarkerMethod,
				addr,
				options.isInput,
				page,
				expPanel,
				key,
				options.isVirtual,
				label,
				marker
			)
		},
	}
	self.setActionDefinitions(actionDefs)
}
