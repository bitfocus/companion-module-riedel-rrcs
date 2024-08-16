export const default_port = 8193

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

export const options = {
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
		tooltip: 'Input should be three period seperated integers <net>.<node>.<port>',
	},
	destVar: {
		id: 'destVar',
		type: 'textinput',
		label: 'Destination',
		default: '1.2.3',
		useVariables: true,
		tooltip: 'Input should be three period seperated integers <net>.<node>.<port>',
	},
}
