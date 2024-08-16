import { combineRgb } from '@companion-module/base'

import { options } from './consts.js'

const colours = {
	black: combineRgb(0, 0, 0),
	white: combineRgb(255, 255, 255),
	red: combineRgb(255, 0, 0),
	green: combineRgb(0, 204, 0),
	darkblue: combineRgb(0, 0, 102),
}

const styles = {
	red: {
		bgcolor: colours.red,
		color: colours.black,
	},
	green: {
		bgcolor: colours.green,
		color: colours.black,
	},
	blue: {
		bgcolor: colours.darkblue,
		color: colours.white,
	},
}

export default async function (self) {
	let feedbackDefs = []
	feedbackDefs['crosspoint'] = {
		name: 'Check Crosspoint',
		type: 'boolean',
		label: 'Check Crosspoint',
		defaultStyle: styles.red,
		options: [
			options.sourceNet,
			options.sourceNode,
			options.sourcePort,
			options.destNet,
			options.destNode,
			options.destPort,
		],
		callback: ({ options }) => {
			try {
				const xpt =
					self.rrcs.crosspoints[`src_net_${options.sourceNet}`][`src_node_${options.sourceNode}`][
						`src_port_${options.sourcePort}`
					][`dst_net_${options.destNet}`][`dst_node_${options.destNode}`][`dst_port_${options.destPort}`]
				return xpt
			} catch {
				if (self.config.verbose) {
					self.log(`debug crosspoint not found`)
				}
				return false
			}
		},
	}
	feedbackDefs['crosspointVar'] = {
		name: 'Check Crosspoint with Variables',
		type: 'boolean',
		label: 'Check Crosspoint (Variables)',
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
	}
	self.setFeedbackDefinitions(feedbackDefs)
}
