import { options } from './consts.js'
import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export default async function (self) {
	let actionDefs = []
	const localPortAddr = self.config.localPanel.split('.')[1] + '.' + self.config.localPanel.split('.')[2]
	const localPortObjectID =
		self.getObjectIDfromAddress(self.calcAddress(self.config.localPanel)) ?? self.rrcs.choices.ports.inputs[0]?.id ?? ''
	actionDefs['setCrosspoint'] = {
		name: 'Crosspoint - Set',
		options: [
			options.xpMethod,
			options.fromList,
			{ ...options.srcAddr, default: self.config.localPanel },
			{ ...options.dstAddr, default: self.config.localPanel },
			{
				...options.srcAddrList,
				choices: self.rrcs.choices.ports.inputs,
				default: localPortObjectID,
			},
			{
				...options.dstAddrList,
				choices: self.rrcs.choices.ports.outputs,
				default: localPortObjectID,
			},
			options.priority,
			options.destructXpInfo,
			options.killXpInfo,
		],
		callback: async ({ options }, context) => {
			const src = options.fromList
				? self.getPortAddressFromObjectID(options.srcAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = options.fromList
				? self.getPortAddressFromObjectID(options.dstAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to setCrosspoint ${options.fromList ? options.srcAddrList : options.srcAddr} ${
							options.fromList ? options.dstAddrList : options.dstAddr
						}`,
					)
				}
				return undefined
			}
			await self.setXp(options.xpMethod, src, dst, options.priority)
		},
		subscribe: async ({ options }, context) => {
			const src = options.fromList
				? self.getPortAddressFromObjectID(options.srcAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = options.fromList
				? self.getPortAddressFromObjectID(options.dstAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to setCrosspoint ${options.fromList ? options.srcAddrList : options.srcAddr} ${
							options.fromList ? options.dstAddrList : options.dstAddr
						}`,
					)
				}
				return undefined
			}
			await self.getXp(src, dst)
		},
	}
	actionDefs['setXPVolume'] = {
		name: 'Crosspoint - Set Volume',
		options: [
			options.fromList,
			{ ...options.srcAddr, default: self.config.localPanel },
			{ ...options.dstAddr, default: self.config.localPanel },
			{
				...options.srcAddrList,
				choices: self.rrcs.choices.ports.inputs,
				default: localPortObjectID,
			},
			{
				...options.dstAddrList,
				choices: self.rrcs.choices.ports.outputs,
				default: localPortObjectID,
			},
			options.conf,
			options.xpVolume,
		],
		callback: async ({ options }, context) => {
			const volume = Number(await context.parseVariablesInString(options.xpVolume))
			const src = options.fromList
				? self.getPortAddressFromObjectID(options.srcAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = options.fromList
				? self.getPortAddressFromObjectID(options.dstAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined || isNaN(volume)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to setCrosspoint Volume ${
							options.fromList ? options.srcAddrList : options.srcAddr
						} ${options.fromList ? options.dstAddrList : options.dstAddr} ${options.xpVolume}`,
					)
				}
				return undefined
			}
			await self.setXPVolume(src, dst, !options.conf, options.conf, volume)
		},
		learn: async ({ options }, context) => {
			const src = options.fromList
				? self.getPortAddressFromObjectID(options.srcAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = options.fromList
				? self.getPortAddressFromObjectID(options.dstAddrList)
				: self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined || isNaN(volume)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to setCrosspoint Volume ${
							options.fromList ? options.srcAddrList : options.srcAddr
						} ${options.fromList ? options.dstAddrList : options.dstAddr} ${options.xpVolume}`,
					)
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
		name: 'Crosspoint - Get All Active',
		options: [],
		callback: async () => {
			await self.getAllXp()
		},
	}
	actionDefs['getAllLogicSources'] = {
		name: 'Logic - Get All Sources',
		options: [],
		callback: async () => {
			await self.getAllLogicSources()
		},
	}
	actionDefs['getAllPorts'] = {
		name: 'Port - Get All',
		options: [],
		callback: async () => {
			await self.getAllPorts()
		},
	}

	if (self.rrcs.choices.logicSources.length > 0) {
		actionDefs['setLogicSource'] = {
			name: 'Logic - Set Source',
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
				await self.setLogicSource(src, options.logicState)
			},
		}
	}
	actionDefs['setGPOutput'] = {
		name: 'GP - Set Output',
		options: [
			options.fromList,
			{ ...options.gpOutputAdder, default: self.config.localPanel + '.0.1' },
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.all,
				default: localPortObjectID,
			},
			options.gpSlotNumber,
			options.gpoState,
		],
		callback: async ({ options }, context) => {
			const gpo = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.gpo))
			const slotNumber = options.fromList
				? self.calcGpioSlotNumber(await context.parseVariablesInString(options.gpSlotNumber))
				: null
			if (gpo === undefined || (options.fromList && slotNumber === undefined)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to GP Output ${options.fromList ? options.addrList : options.gpo}${
							options.fromList ? ' ' + options.slotNumber : ''
						}`,
					)
				}
				return false
			}
			await self.setGPOutput(
				{
					net: gpo.net,
					node: gpo.node,
					port: gpo.port,
					slot: options.fromList ? slotNumber.slot : gpo.slot,
					number: options.fromList ? slotNumber.number : gpo.number,
				},
				options.gpoState,
			)
		},
		subscribe: async ({ options }, context) => {
			const gpo = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.gpo))
			const slotNumber = options.fromList
				? self.calcGpioSlotNumber(await context.parseVariablesInString(options.gpSlotNumber))
				: null
			if (gpo === undefined || (options.fromList && slotNumber === undefined)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to GP Output Subscribe ${options.fromList ? options.addrList : options.gpo}${
							options.fromList ? ' ' + options.slotNumber : ''
						}`,
					)
				}
				return false
			}
			await self.getGPOutput({
				net: gpo.net,
				node: gpo.node,
				port: gpo.port,
				slot: options.fromList ? slotNumber.slot : gpo.slot,
				number: options.fromList ? slotNumber.number : gpo.number,
			})
		},
	}
	actionDefs['setAlias'] = {
		name: 'Port - Set Alias',
		options: [
			options.fromList,
			options.addr,
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.all,
				default: self.rrcs.choices.ports.all[0]?.id ?? '',
			},
			options.isInput,
			options.alias,
		],
		callback: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.addr))
			const alias = await context.parseVariablesInString(options.alias)
			const isInput = options.fromList ? addr.isInput : options.isInput
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid address supplied to setAlias ${options.addr}`)
				}
				return false
			}
			await self.setAlias(addr, isInput, alias)
		},
		learn: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.addr))
			const isInput = options.fromList ? addr.isInput : options.isInput
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
				isInput,
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
		name: 'Port - Set Label',
		options: [
			options.fromList,
			options.portAddr,
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.local.all,
				default: self.rrcs.choices.ports.local.all[0]?.id ?? '',
			},
			options.isInput,
			options.portLabel,
		],
		callback: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const isInput = options.fromList ? addr.isInput : options.isInput
			const label = await context.parseVariablesInString(options.portLabel)
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid address supplied to setPortLabel ${options.fromList ? options.addrList : options.portAddr}`,
					)
				}
				return false
			}
			await self.setPortLabel(addr, isInput, label)
		},
		learn: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const isInput = options.fromList ? addr.isInput : options.isInput
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid address supplied to setPortLabel ${options.fromList ? options.addrList : options.portAddr}`,
					)
				}
				return undefined
			}
			const response = await self.rrcsMethodCall(rrcsMethods.portLabel.get.rpc, [addr.node, addr.port, isInput])
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
		name: 'Port - Set IO Gain',
		options: [
			options.ioMethod,
			options.fromList,
			{ ...options.addr, default: self.config.localPanel },
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.all,
				default: localPortObjectID,
			},
			options.ioGain,
			options.ioGainInfo,
		],
		callback: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcAddress(await context.parseVariablesInString(options.addr))
			const gain = Number(await context.parseVariablesInString(options.ioGain))
			if (addr === undefined || isNaN(gain)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid address supplied to setIOGain ${options.fromList ? options.addrList : options.addr} ${
							options.gain
						}`,
					)
				}
				return false
			}
			await self.setIOGain(addr, options.ioMethod, gain)
		},
		learn: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.addr))
			const method = options.ioMethod.replace('Set', 'Get')
			if (addr === undefined) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid address supplied to setIOGain ${options.fromList ? options.addrList : options.addr}`,
					)
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
			options.fromList,
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.local.all,
				default: localPortObjectID,
			},
			{ ...options.portAddr, default: localPortAddr },
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
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.portAddr))
			const isInput = options.fromList ? addr.isInput : options.isInput
			const page = parseInt(await context.parseVariablesInString(options.page))
			const expPanel = parseInt(await context.parseVariablesInString(options.expPanel))
			const key = parseInt(await context.parseVariablesInString(options.keyNumber))
			const pool = parseInt(await context.parseVariablesInString(options.poolPort))
			if (addr === undefined || isNaN(page) || isNaN(expPanel) || isNaN(key) || isNaN(pool)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid args supplied to pressKey ${options.fromList ? options.addrList : options.portAddr} ${
							options.page
						} ${options.expPanel} ${options.keyNumber} ${options.poolPort}`,
					)
				}
				return undefined
			}
			await self.pressKey(addr, isInput, page, expPanel, key, options.isVirtual, options.press, options.trigger, pool)
		},
	}
	actionDefs['keyLock'] = {
		name: 'Key - Lock',
		options: [
			options.fromList,
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.local.all,
				default: localPortObjectID,
			},
			{ ...options.portAddr, default: localPortAddr },
			options.isInput,
			options.page,
			options.expPanel,
			options.keyNumber,
			options.isVirtual,
			options.keyLock,
			options.poolPort,
		],
		callback: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.portAddr))
			const isInput = options.fromList ? addr.isInput : options.isInput
			const page = parseInt(await context.parseVariablesInString(options.page))
			const expPanel = parseInt(await context.parseVariablesInString(options.expPanel))
			const key = parseInt(await context.parseVariablesInString(options.keyNumber))
			const pool = parseInt(await context.parseVariablesInString(options.poolPort))
			if (addr === undefined || isNaN(page) || isNaN(expPanel) || isNaN(key) || isNaN(pool)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid args supplied to keyLock ${options.fromList ? options.addrList : options.portAddr} ${
							options.page
						} ${options.expPanel} ${options.keyNumber} ${options.poolPort}`,
					)
				}
				return undefined
			}
			await self.lockKey(addr, isInput, page, expPanel, key, options.isVirtual, options.keyLock, pool)
		},
	}

	actionDefs['keyLabelAndMarker'] = {
		name: 'Key - Label & Marker',
		options: [
			options.labelAndMarkerMethod,
			options.fromList,
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.local.panels,
				default: localPortObjectID,
			},
			{ ...options.portAddr, default: localPortAddr },
			options.isInput,
			options.page,
			options.expPanel,
			options.keyNumber,
			options.isVirtual,
			options.keyLabel,
			options.keyMarker,
		],
		callback: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.portAddr))
			const isInput = options.fromList ? addr.isInput : options.isInput
			const page = parseInt(await context.parseVariablesInString(options.page))
			const expPanel = parseInt(await context.parseVariablesInString(options.expPanel))
			const key = parseInt(await context.parseVariablesInString(options.keyNumber))
			const label = await context.parseVariablesInString(options.keyLabel)
			const marker = parseInt(await context.parseVariablesInString(options.keyMarker))
			if (addr === undefined || isNaN(page) || isNaN(expPanel) || isNaN(key) || isNaN(marker)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid args supplied to pressKey ${options.fromList ? options.addrList : options.portAddr} ${
							options.page
						} ${options.expPanel} ${options.keyNumber} ${options.keyMarker}`,
					)
				}
				return undefined
			}
			await self.labelAndMarker(
				options.labelAndMarkerMethod,
				addr,
				isInput,
				page,
				expPanel,
				key,
				options.isVirtual,
				label,
				marker,
			)
		},
	}
	actionDefs['portClone'] = {
		name: 'Port - Clone',
		options: [
			options.cloneMethod,
			options.fromList,
			{
				...options.monitorAddrList,
				choices: self.rrcs.choices.ports.local.outputs,
				default: self.rrcs.choices.ports.local.outputs[0]?.id ?? '',
			},
			options.monitorAddr,
			options.isInput,
			options.isInputClonePort,
			{ ...options.cloneAddr, default: localPortAddr },
			{
				...options.cloneAddrList,
				choices: self.rrcs.choices.ports.local.outputs,
				default: localPortObjectID,
			},
			options.cloneInfo,
		],
		callback: async ({ options }, context) => {
			const monitor = options.fromList
				? self.getPortAddressFromObjectID(options.monitorAddrList)
				: self.calcPortAddress(await context.parseVariablesInString(options.monitorAddr))
			const clone = options.fromList
				? self.getPortAddressFromObjectID(options.cloneAddrList)
				: self.calcPortAddress(await context.parseVariablesInString(options.cloneAddr))
			if (monitor === undefined || clone === undefined) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to portClone ${
							options.fromList ? options.monitorAddrList : options.monitorAddr
						} ${options.fromList ? options.cloneAddrList : options.cloneAddr}`,
					)
				}
				return undefined
			}
			await self.portClone(options.cloneMethod, monitor, options.isInput, options.isInputClonePort, clone)
		},
	}
	actionDefs['getAllIFBS'] = {
		name: 'IFB - Get All',
		options: [],
		callback: async () => {
			await self.getAllIFBs()
		},
	}
	actionDefs['ifbMixMinusVolume'] = {
		name: 'IFB - Mix Minus Volume',
		options: [
			options.ifbMethod,
			options.fromList,
			{ ...options.portAddr, default: localPortAddr },
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.local.inputs,
				default: self.rrcs.choices.ports.local.inputs[0]?.id ?? '',
			},
			options.ifbNumber,
			{
				...options.ifbList,
				choices: self.rrcs.choices.ifbs,
				default: self.rrcs.choices.ifbs[0]?.id ?? '',
			},
			options.ifbVolume,
			options.ifbVolumeSetInfo,
			options.ifbVolumeRemoveInfo,
		],
		callback: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const isInput = options.fromList ? addr.isInput : true
			const ifbNum = options.fromList
				? self.getIFBAddressFromObjectID(options.ifbList)
				: parseInt(await context.parseVariablesInString(options.ifbNumber))
			const ifbVolume = Number(await context.parseVariablesInString(options.ifbVolume))
			if (addr === undefined || isNaN(ifbNum) || isNaN(ifbVolume)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid address supplied to ifbSetVolume ${options.fromList ? options.addrList : options.portAddr} ${
							options.fromList ? options.ifbList : options.ifbNumber
						} ${options.ifbVolume}`,
					)
				}
				return false
			}
			await self.setIFBVolume(options.ifbMethod, addr, isInput, ifbNum, ifbVolume)
		},
		learn: async ({ options }, context) => {
			const addr = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcPortAddress(await context.parseVariablesInString(options.portAddr))
			const isInput = options.fromList ? addr.isInput : true
			const ifbNum = options.fromList
				? self.getIFBAddressFromObjectID(options.ifbList)
				: parseInt(await context.parseVariablesInString(options.ifbNumber))
			if (addr === undefined || isNaN(ifbNum)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid address supplied to ifbSetVolume learn ${options.fromList ? options.addrList : options.portAddr} ${
							options.fromList ? options.ifbList : options.ifbNumber
						}`,
					)
				}
				return undefined
			}
			const response = await self.rrcsMethodCall(rrcsMethods.ifbVolume.get.rpc, [addr.node, addr.port, isInput, ifbNum])
			if (response === undefined) {
				return undefined
			}
			if (self.config.verbose) {
				self.log('debug', `setIFBVolume learn: \n${JSON.stringify(response)}`)
			}
			if (!Array.isArray(response[1])) {
				self.log('warn', `setIFBVolume learn returned unexpected data ${response}`)
				return undefined
			}
			for (const ifbVol of response[1]) {
				if (addr.node === ifbVol.Node && addr.port === ifbVol.Port && ifbNum === ifbVol.IfbNumber) {
					const volume = (ifbVol.Volume - 230) / 2
					return {
						...options,
						ifbVolume: volume,
					}
				}
			}
			return undefined
		},
	}
	self.setActionDefinitions(actionDefs)
}
