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
		options: [options.sourceNet, options.sourceNode, options.sourcePort, options.destNet, options.destNode, options.destPort],
		callback: ({ options }) => {
			console.log('checking crosspoint feedback')
			try {
				const xpt =
					self.rrcs.crosspoint[options.sourceNet][options.sourceNode][options.sourcePort][options.destNet][
						options.destNode
					][options.destPort]
				self.log('debug', `Checking crosspoint value found: ${xpt}`)
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
