import { options, styles } from './consts.js'

export default async function (self) {
	let feedbackDefs = []
	feedbackDefs['crosspoint'] = {
		name: 'Check Crosspoint',
		type: 'boolean',
		label: 'Check Crosspoint',
		defaultStyle: styles.red,
		options: [options.srcAddr, options.dstAddr],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to check crosspoint ${src} ${dst}`)
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
					self.log(`debug crosspoint not found`)
				}
				return false
			}
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.srcAddr))
			const dst = self.calcAddress(await context.parseVariablesInString(options.dstAddr))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to check crosspoint ${src} ${dst}`)
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
			label: 'Logic Source',
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
						self.log('debug', `invalid variables supplied to logic source feedback ${src}`)
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

	self.setFeedbackDefinitions(feedbackDefs)
}
