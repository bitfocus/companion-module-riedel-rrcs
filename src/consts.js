import { combineRgb } from '@companion-module/base'
import { rrcsMethods } from './methods.js'

export const default_port = 8193

const colours = {
	black: combineRgb(0, 0, 0),
	white: combineRgb(255, 255, 255),
	red: combineRgb(255, 0, 0),
	green: combineRgb(0, 204, 0),
	darkblue: combineRgb(0, 0, 102),
}

export const styles = {
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

export const limits = {
	net: {
		min: 1,
		max: 255,
		default: 1,
	},
	node: {
		min: 2,
		max: 255,
		default: 2,
	},
	port: {
		min: 0,
		max: 1151,
		default: 1,
	},
	clientCardSlot: {
		min: 1,
		max: 16,
		default: 1,
	},
	gain: {
		min: -36,
		max: 36,
		default: 0,
		factor: 0.5,
		mute: -128,
	},
	volume: {
		min: 1,
		max: 255,
		offset: -230,
		factor: 0.5,
		default: 230,
		mute: 0,
	},
	alias: {
		maxLength: 8,
	},
}

export const lookUps = {
	priority: {
		0: 'Below standard',
		1: 'Standard',
		2: 'High',
		3: 'Paging',
		4: 'Emergency',
	},
	status: {
		0: 'Inactive',
		1: 'Active',
	},
	ethernetLinkMode: {
		1: 'Auto',
		2: '10Mb Half Duplex',
		3: '10Mb Full Duplex',
		4: '100Mb Half Duplex',
		5: '100Mb Full Duplex',
	},
	trunkCmdType: {
		1: 'Call to Port',
		2: 'Listen to Port',
		4: 'Call to Conference',
		5: 'Call to Group',
		48: 'Call to IFB',
		201: 'IFB Listen to Port',
		202: 'Listen to telex IFB Listen Source',
		203: 'Listen to Artist IFB - MixMinus',
		204: 'Listen to Artist IFB-Input',
		205: 'Conference Call to Conference',
	},
	lineStatus: {
		0: 'Unknown',
		1: 'Line is Free',
		2: 'Waiting for Connection',
		3: 'Line is Busy',
	},
}

export const choices = {
	xpMethods: [
		{ id: rrcsMethods.crosspoint.set.rpc, label: rrcsMethods.crosspoint.set.name },
		{ id: rrcsMethods.crosspoint.setPrio.rpc, label: rrcsMethods.crosspoint.setPrio.name },
		{ id: rrcsMethods.crosspoint.setDestruct.rpc, label: rrcsMethods.crosspoint.setDestruct.name },
		{ id: rrcsMethods.crosspoint.kill.rpc, label: rrcsMethods.crosspoint.kill.name },
	],
	priority: [
		{ id: 0, label: lookUps.priority[0] },
		{ id: 1, label: lookUps.priority[1] },
		{ id: 2, label: lookUps.priority[2] },
		{ id: 3, label: lookUps.priority[3] },
		{ id: 4, label: lookUps.priority[4] },
	],
}

export const options = {
	xpMethod: {
		id: 'xpMethod',
		type: 'dropdown',
		label: 'Method',
		choices: choices.xpMethods,
		default: rrcsMethods.crosspoint.set.rpc,
	},
	sourceNet: {
		id: 'sourceNet',
		type: 'number',
		label: 'Source Net',
		default: limits.net.default,
		min: limits.net.min,
		max: limits.net.max,
	},
	sourceNode: {
		id: 'sourceNode',
		type: 'number',
		label: 'Source Node',
		default: limits.node.default,
		min: limits.node.min,
		max: limits.node.max,
	},
	sourcePort: {
		id: 'sourcePort',
		type: 'number',
		label: 'Source Port',
		default: limits.port.default,
		min: limits.port.min,
		max: limits.port.max,
	},
	destNet: {
		id: 'destNet',
		type: 'number',
		label: 'Destination Net',
		default: limits.net.default,
		min: limits.net.min,
		max: limits.net.max,
	},
	destNode: {
		id: 'destNode',
		type: 'number',
		label: 'Destination Node',
		default: limits.node.default,
		min: limits.node.min,
		max: limits.node.max,
	},
	destPort: {
		id: 'destPort',
		type: 'number',
		label: 'Destination Port',
		default: limits.port.default,
		min: limits.port.min,
		max: limits.port.max,
	},
	sourceVar: {
		id: 'sourceVar',
		type: 'textinput',
		label: 'Source',
		default: '1.2.3',
		useVariables: true,
		tooltip: 'Source address should be three period seperated integers <net>.<node>.<port>',
	},
	destVar: {
		id: 'destVar',
		type: 'textinput',
		label: 'Destination',
		default: '1.2.3',
		useVariables: true,
		tooltip: 'Destination address should be three period seperated integers <net>.<node>.<port>',
	},
	priority: {
		id: 'priority',
		type: 'dropdown',
		label: 'Priority',
		default: choices.priority[1].id,
		choices: choices.priority,
		isVisible: (options) => {
			return options.xpMethod === 'SetXpPrio' || options.xpMethod === 'SetXpDestructive'
		},
	},
	destructXpInfo: {
		id: 'destructXpInfo',
		type: 'static-text',
		label: '',
		value: rrcsMethods.crosspoint.setDestruct.description,
		isVisible: (options) => {
			return options.xpMethod === 'SetXpDestructive'
		},
	},
	killXpInfo: {
		id: 'killXpInfo',
		type: 'static-text',
		label: '',
		value: rrcsMethods.crosspoint.kill.description,
		isVisible: (options) => {
			return options.xpMethod === 'KillXp'
		},
	},
}
