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
					self.rrcs.crosspoints[`src_net_${src.net}`][`src_node_${src.node}`][`src_port_${src.port}`][`dst_net_${dst.net}`][
						`dst_node_${dst.node}`
					][`dst_port_${dst.port}`]
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
			self.getXp(src, dst)
		},
	}
	self.setFeedbackDefinitions(feedbackDefs)
}
