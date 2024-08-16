import { options, styles } from './consts.js'

export default async function (self) {
	let feedbackDefs = []
	feedbackDefs['crosspoint'] = {
		name: 'Check Crosspoint',
		type: 'boolean',
		label: 'Check Crosspoint',
		defaultStyle: styles.red,
		options: [options.sourceVar, options.destVar],
		callback: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to crosspointVar ${src} ${dst}`)
				}
				return false
			}
			try {
				const xpt =
					self.rrcs.crosspoints[`src_net_${src[0]}`][`src_node_${src[1]}`][`src_port_${src[2]}`][`dst_net_${dst[0]}`][
						`dst_node_${dst[1]}`
					][`dst_port_${dst[2]}`]
				return xpt
			} catch {
				if (self.config.verbose) {
					self.log(`debug crosspoint not found`)
				}
				return false
			}
		},
		subscribe: async ({ options }, context) => {
			const src = self.calcAddress(await context.parseVariablesInString(options.sourceVar))
			const dst = self.calcAddress(await context.parseVariablesInString(options.destVar))
			if (src === undefined || dst === undefined) {
				if (self.config.verbose) {
					self.log('debug', `invalid variables supplied to crosspoint ${src} ${dst}`)
				}
				return false
			}
			this.getXp({ net: src[0], node: src[1], port: src[2] }, { net: dst[0], node: dst[1], port: dst[2] })
		},
	}
	self.setFeedbackDefinitions(feedbackDefs)
}
