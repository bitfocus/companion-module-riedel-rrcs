import { options, styles } from './consts.js'

export default async function (self) {
	let feedbackDefs = []
	feedbackDefs['crosspoint'] = {
		name: 'Check Crosspoint',
		type: 'boolean',
		defaultStyle: styles.red,
		options: [options.srcAddr, options.dstAddr],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to check crosspoint ${options.srcAddr} ${options.dstAddr}`)
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
					self.log('debug', `invalid variables supplied to check crosspoint ${options.srcAddr} ${options.dstAddr}`)
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
		name: 'Check GP Output',
		type: 'boolean',
		defaultStyle: styles.green,
		options: [options.gpOutputAdder],
		callback: async ({ options }, context) => {
			const gpo = self.calcGpioAddress(await context.parseVariablesInString(options.gpo))
			if (gpo === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to Check GP Output ${options.gpo}`)
				}
				return false
			}
			try {
				return self.rrcs.gpOutputs[`net_${gpo.net}`][`node_${gpo.node}`][`port_${gpo.port}`][`slot_${gpo.slot}`][
					`number_${gpo.number}`
				]
			} catch {
				if (self.config.verbose) {
					self.log(`debug`, `gpo not found`)
				}
				return false
			}
		},
		subscribe: async ({ options }, context) => {
			const gpo = self.calcGpioAddress(await context.parseVariablesInString(options.gpo))
			if (gpo === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to Check GP Output Subscribe ${options.gpo}`)
				}
				return false
			}
			self.getGPOutput(gpo)
		},
	}

	feedbackDefs['gpiState'] = {
		name: 'Check GP Input',
		type: 'boolean',
		defaultStyle: styles.green,
		options: [options.gpInputAdder],
		callback: async ({ options }, context) => {
			const gpi = self.calcGpioAddress(await context.parseVariablesInString(options.gpi))
			if (gpi === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to Check GP Input ${options.gpi}`)
				}
				return false
			}
			try {
				return self.rrcs.gpInputs[`net_${gpi.net}`][`node_${gpi.node}`][`port_${gpi.port}`][`slot_${gpi.slot}`][
					`number_${gpi.number}`
				]
			} catch {
				if (self.config.verbose) {
					self.log(`debug`, `gpi not found`)
				}
				return false
			}
		},
		subscribe: async ({ options }, context) => {
			const gpi = self.calcGpioAddress(await context.parseVariablesInString(options.gpi))
			if (gpi === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to Check GP Input Subscribe ${options.gpi}`)
				}
				return false
			}
			self.getGPInput(gpi)
		},
	}
	self.setFeedbackDefinitions(feedbackDefs)
}
