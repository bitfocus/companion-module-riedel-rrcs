import { combineRgb, Regex } from '@companion-module/base'
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
		min: 1,
		max: 1152,
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
	ioGain: [
		{ id: rrcsMethods.gain.setInput.rpc, label: rrcsMethods.gain.setInput.name },
		{ id: rrcsMethods.gain.setOutput.rpc, label: rrcsMethods.gain.setOutput.name },
	],
	trigger: [
		{ id: 1, label: 'Primary Trigger' },
		{ id: 2, label: 'Secondary Trigger' },
	],
	labelAndMarker: [
		{ id: rrcsMethods.keyManipulations.setKeyLabel.rpc, label: rrcsMethods.keyManipulations.setKeyLabel.name },
		{ id: rrcsMethods.keyManipulations.setKeyMarker.rpc, label: rrcsMethods.keyManipulations.setKeyMarker.name },
		{
			id: rrcsMethods.keyManipulations.setKeyLabelAndMarker.rpc,
			label: rrcsMethods.keyManipulations.setKeyLabelAndMarker.name,
		},
		{ id: rrcsMethods.keyManipulations.clearKeyLabel.rpc, label: rrcsMethods.keyManipulations.clearKeyLabel.name },
		{ id: rrcsMethods.keyManipulations.clearKeyMarker.rpc, label: rrcsMethods.keyManipulations.clearKeyMarker.name },
		{
			id: rrcsMethods.keyManipulations.clearKeyLabelAndMarker.rpc,
			label: rrcsMethods.keyManipulations.clearKeyLabelAndMarker.name,
		},
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
	addr: {
		id: 'addr',
		type: 'textinput',
		label: 'Address',
		default: '1.2.3',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Address should be three period seperated integers <net>.<node>.<port>',
	},
	portAddr: {
		id: 'portAddr',
		type: 'textinput',
		label: 'Port Address',
		default: '1.2',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Address should be two period seperated integers <node>.<port>',
	},
	isInput: {
		id: 'isInput',
		type: 'checkbox',
		label: 'Input',
		default: false,
	},
	srcAddr: {
		id: 'srcAddr',
		type: 'textinput',
		label: 'Source',
		default: '1.2.3',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Source address should be three period seperated integers <net>.<node>.<port>',
	},
	dstAddr: {
		id: 'dstAddr',
		type: 'textinput',
		label: 'Destination',
		default: '1.2.3',
		useVariables: true,
		regex: Regex.SOMETHING,
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
	logicSrc: {
		id: 'logicSrc',
		type: 'dropdown',
		label: 'Logic Source',
		allowCustom: true,
		tooltip: 'Variable must return logic source Object ID',
	},
	logicState: {
		id: 'logicState',
		type: 'checkbox',
		label: 'State',
		default: false,
	},
	gpOutputAdder: {
		id: 'gpo',
		type: 'textinput',
		label: 'GPO',
		default: '1.2.3.4.5',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'GP Output address should be five period seperated integers <net>.<node>.<port>.<slot>.<gpio number>',
	},
	gpInputAdder: {
		id: 'gpi',
		type: 'textinput',
		label: 'GPI',
		default: '1.2.3.4.5',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'GP Input address should be five period seperated integers <net>.<node>.<port>.<slot>.<gpio number>',
	},
	gpoState: {
		id: 'gpoState',
		type: 'checkbox',
		label: 'State',
		default: false,
	},
	alias: {
		id: 'alias',
		type: 'textinput',
		label: 'Port Alias',
		default: '',
		useVariables: true,
		tooltip:
			'Alias name for the given port which is displayed on the panel keys. A string with a maximum of 8 characters.',
	},
	portLabel: {
		id: 'portLabel',
		type: 'textinput',
		label: 'Port Label',
		default: '',
		useVariables: true,
		tooltip: 'Port Label may be a maximum of 8 characters.',
	},
	ioMethod: {
		id: 'ioMethod',
		type: 'dropdown',
		label: 'Method',
		choices: choices.ioGain,
		default: rrcsMethods.gain.setInput.rpc,
	},
	conf: {
		id: 'conf',
		type: 'checkbox',
		label: 'Conference',
		default: false,
	},
	xpVolume: {
		id: 'xpVolume',
		type: 'textinput',
		label: 'Crosspoint Volume(dB)',
		default: '0',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Range: -114.5 to +12.5, 0.5dB steps. Set to <= -115 to mute.',
	},

	ioGain: {
		id: 'ioGain',
		type: 'textinput',
		label: 'IO Gain (dB)',
		default: '0',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Range: -18 to +18, 0.5dB steps. Set to <= -64 to mute.',
	},
	ioGainInfo: {
		id: 'ioGainInfo',
		type: 'static-text',
		label: '',
		value: 'Ensure the selected port has enabled gain set by Panel or RRCS. See Director > Port Properties > Gain.',
	},
	page: {
		id: 'page',
		type: 'textinput',
		label: 'Page',
		default: '1',
		useVariables: true,
		tooltip: 'Key page number.',
	},
	expPanel: {
		id: 'expPanel',
		type: 'textinput',
		label: 'Expansion Panel',
		default: '0',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Expansion panel number.',
	},
	keyNumber: {
		id: 'keyNumber',
		type: 'textinput',
		label: 'Key Number',
		default: '1',
		regex: Regex.SOMETHING,
		useVariables: true,
	},
	isVirtual: {
		id: 'isVirtual',
		type: 'checkbox',
		label: 'Virtual Key',
		default: false,
	},
	press: {
		id: 'press',
		type: 'checkbox',
		label: 'Press',
		default: true,
	},
	trigger: {
		id: 'trigger',
		type: 'dropdown',
		label: 'Trigger',
		choices: choices.trigger,
		default: 1,
	},
	triggerInfo: {
		id: 'triggerInfo',
		type: 'static-text',
		label: '',
		value: rrcsMethods.keyManipulations.pressKeyEx.description,
	},
	poolPort: {
		id: 'poolPort',
		type: 'textinput',
		label: 'Pool Port',
		default: '0',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Expansion panel number.',
	},
	labelAndMarkerMethod: {
		id: 'labelAndMarkerMethod',
		type: 'dropdown',
		label: 'Method',
		choices: choices.labelAndMarker,
		default: rrcsMethods.keyManipulations.setKeyLabelAndMarker.rpc,
	},
	keyMarker: {
		id: 'keyMarker',
		type: 'textinput',
		label: 'Marker',
		default: '1',
		regex: Regex.SOMETHING,
		useVariables: true,
		tooltip: '{Marker} is the index of the marker in the configuration. See the net propertiesdialog in Director.',
		isVisible: (options) => {
			return options.labelAndMarkerMethod === 'SetKeyLabelAndMarker' || options.labelAndMarkerMethod === 'SetKeyMarker'
		},
	},
	keyLabel: {
		id: 'keyLabel',
		type: 'textinput',
		label: ' Label',
		default: '',
		useVariables: true,
		tooltip: 'Key Label may be a maximum of 8 characters.',
		isVisible: (options) => {
			return options.labelAndMarkerMethod === 'SetKeyLabelAndMarker' || options.labelAndMarkerMethod === 'SetKeyLabel'
		},
	},
	keyLock: {
		id: 'keyLock',
		type: 'checkbox',
		label: 'Lock',
		default: false,
	},
}
