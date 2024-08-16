import { options } from './consts.js'
import { rrcsMethods } from './methods.js'

export default async function (self) {
	let actionDefs = []
	actionDefs['setCrosspoint'] = {
		name: 'Set Crosspoint',
		options: [
			options.sourceNet,
			options.sourceNode,
			options.sourcePort,
			options.destNet,
			options.destNode,
			options.destPort,
		],
		callback: async ({ options }) => {
			self.rrcsQueue.add(() =>
				self.rrcsMethodCall(rrcsMethods.crosspoint.set.rpc, [
					options.sourceNet,
					options.sourceNode,
					options.sourcePort,
					options.destNet,
					options.destNode,
					options.destPort,
				])
			)
		},
	}
	actionDefs['killCrosspoint'] = {
		name: 'Kill Crosspoint',
		options: [
			options.sourceNet,
			options.sourceNode,
			options.sourcePort,
			options.destNet,
			options.destNode,
			options.destPort,
		],
		callback: async ({ options }) => {
			self.rrcsQueue.add(() =>
				self.rrcsMethodCall(rrcsMethods.crosspoint.kill.rpc, [
					options.sourceNet,
					options.sourceNode,
					options.sourcePort,
					options.destNet,
					options.destNode,
					options.destPort,
				])
			)
		},
	}
	self.setActionDefinitions(actionDefs)
}
