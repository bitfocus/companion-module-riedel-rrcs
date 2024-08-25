import { options, styles } from './consts.js'

export default async function (self) {
	let feedbackDefs = []
	const localPortObjectID =
		self.getObjectIDfromAddress(self.calcAddress(self.config.localPanel)) ?? self.rrcs.choices.ports.inputs[0]?.id ?? ''
	feedbackDefs['crosspoint'] = {
		name: 'Crosspoint',
		type: 'boolean',
		defaultStyle: styles.red,
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
					self.log('debug', `invalid variables supplied to crosspoint feedback ${options.srcAddr} ${options.dstAddr}`)
				}
				return false
			}
			try {
				const xpt =
					self.rrcs.crosspoints[`src_net_${src.net}`][`src_node_${src.node}`][`src_port_${src.port}`][
						`dst_net_${dst.net}`
					][`dst_node_${dst.node}`][`dst_port_${dst.port}`]
				return xpt
			} catch {
				if (self.config.verbose) {
					self.log(`debug`, `crosspoint not found ${JSON.stringify(src)} ${JSON.stringify(dst)}`)
				}
				return false
			}
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to crosspoint feedback ${options.srcAddr} ${options.dstAddr}`)
				}
				return false
			}
			self.getXp(src, dst)
		},
	}
	if (self.rrcs.choices.logicSources.length > 0) {
		feedbackDefs['logicSource'] = {
			name: 'Logic Source',
			type: 'boolean',
			defaultStyle: styles.green,
			options: [
				{
					...options.logicSrc,
					choices: self.rrcs.choices.logicSources,
					default: self.rrcs.choices.logicSources[0].id,
				},
			],
			callback: async ({ options }, context) => {
				const src = parseInt(await context.parseVariablesInString(options.logicSrc))
				if (isNaN(src)) {
					if (self.config.verbose) {
						self.log('debug', `invalid variables supplied to logic source feedback ${options.logicSrc}`)
					}
					return false
				}
				try {
					return self.rrcs.logicSrc[src].state
				} catch {
					if (self.config.verbose) {
						self.log(`logic source not found`)
					}
					return false
				}
			},
		}
	}

	feedbackDefs['gpoState'] = {
		name: 'GP Output',
		type: 'boolean',
		defaultStyle: styles.green,
		options: [
			options.fromList,
			{ ...options.gpOutputAdder, default: self.config.localPanel + '.0.1' },
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.all,
				default: localPortObjectID,
			},
			options.gpSlotNumber,
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
			try {
				return self.rrcs.gpOutputs[`net_${gpo.net}`][`node_${gpo.node}`][`port_${gpo.port}`][
					`slot_${options.fromList ? slotNumber.slot : gpo.slot}`
				][`number_${options.fromList ? slotNumber.number : gpo.number}`]
			} catch {
				if (self.config.verbose) {
					self.log(`debug`, `gpo not found`)
				}
				return false
			}
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
			self.getGPOutput({
				net: gpo.net,
				node: gpo.node,
				port: gpo.port,
				slot: options.fromList ? slotNumber.slot : gpo.slot,
				number: options.fromList ? slotNumber.number : gpo.number,
			})
		},
	}

	feedbackDefs['gpiState'] = {
		name: 'GP Input',
		type: 'boolean',
		defaultStyle: styles.green,
		options: [
			options.fromList,
			{ ...options.gpInputAdder, default: self.config.localPanel + '.0.1' },
			{
				...options.addrList,
				choices: self.rrcs.choices.ports.all,
				default: localPortObjectID,
			},
			options.gpSlotNumber,
		],
		callback: async ({ options }, context) => {
			const gpi = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.gpi))
			const slotNumber = options.fromList
				? self.calcGpioSlotNumber(await context.parseVariablesInString(options.gpSlotNumber))
				: null
			if (gpi === undefined || (options.fromList && slotNumber === undefined)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to GP Input ${options.gpi}${options.fromList ? ' ' + options.slotNumber : ''}`,
					)
				}
				return false
			}
			try {
				return self.rrcs.gpInputs[`net_${gpi.net}`][`node_${gpi.node}`][`port_${gpi.port}`][
					`slot_${options.fromList ? slotNumber.slot : gpi.slot}`
				][`number_${options.fromList ? slotNumber.number : gpi.number}`]
			} catch {
				if (self.config.verbose) {
					self.log(`debug`, `gpi not found`)
				}
				return false
			}
		},
		subscribe: async ({ options }, context) => {
			const gpi = options.fromList
				? self.getPortAddressFromObjectID(options.addrList)
				: self.calcGpioAddress(await context.parseVariablesInString(options.gpi))
			const slotNumber = options.fromList
				? self.calcGpioSlotNumber(await context.parseVariablesInString(options.gpSlotNumber))
				: null
			if (gpi === undefined || (options.fromList && slotNumber === undefined)) {
				if (self.config.verbose) {
					self.log(
						'debug',
						`invalid variables supplied to GP Input Subscribe ${options.fromList ? options.addrList : options.gpi}${
							options.fromList ? ' ' + options.slotNumber : ''
						}`,
					)
				}
				return false
			}
			self.getGPInput({
				net: gpi.net,
				node: gpi.node,
				port: gpi.port,
				slot: options.fromList ? slotNumber.slot : gpi.slot,
				number: options.fromList ? slotNumber.number : gpi.number,
			})
		},
	}
	self.setFeedbackDefinitions(feedbackDefs)
}
