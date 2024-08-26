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
	clone: [
		{ id: rrcsMethods.portClone.start.rpc, label: rrcsMethods.portClone.start.name },
		{ id: rrcsMethods.portClone.stop.rpc, label: rrcsMethods.portClone.stop.name },
	],
	ifb: [
		{ id: rrcsMethods.ifbVolume.set.rpc, label: rrcsMethods.ifbVolume.set.name },
		{ id: rrcsMethods.ifbVolume.remove.rpc, label: rrcsMethods.ifbVolume.remove.name },
	],
	portDetails: [
		{ id: 'LongName', label: 'Long Name' },
		{ id: 'Label', label: 'Label' },
		{ id: 'Address', label: 'Address' },
		{ id: 'Port', label: 'Port Number' },
		{ id: 'PortType', label: 'Port Type' },
		{ id: 'KeyCount', label: 'Key Count' },
	],
}

export const options = {
	fromList: {
		id: 'fromList',
		type: 'checkbox',
		label: 'Select Address from List',
		default: false,
	},
	xpMethod: {
		id: 'xpMethod',
		type: 'dropdown',
		label: 'Method',
		choices: choices.xpMethods,
		default: rrcsMethods.crosspoint.set.rpc,
	},
	addrList: {
		id: 'addrList',
		type: 'dropdown',
		label: 'Port',
		isVisible: (options) => {
			return options.fromList
		},
	},
	addr: {
		id: 'addr',
		type: 'textinput',
		label: 'Address',
		default: '1.2.3',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Address should be three period seperated integers <net>.<node>.<port>',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	portAddr: {
		id: 'portAddr',
		type: 'textinput',
		label: 'Port Address',
		default: '1.2',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Address should be two period seperated integers <node>.<port>',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	isInput: {
		id: 'isInput',
		type: 'checkbox',
		label: 'Input Port',
		default: true,
		tooltip: 'For split ports, select the input or output. For standard panels and 4 wire ports can left enabled.',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	srcAddr: {
		id: 'srcAddr',
		type: 'textinput',
		label: 'Source',
		default: '1.2.3',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Source address should be three period seperated integers <net>.<node>.<port>',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	srcAddrList: {
		id: 'srcAddrList',
		type: 'dropdown',
		label: 'Source',
		isVisible: (options) => {
			return options.fromList
		},
	},
	dstAddr: {
		id: 'dstAddr',
		type: 'textinput',
		label: 'Destination',
		default: '1.2.3',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Destination address should be three period seperated integers <net>.<node>.<port>',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	dstAddrList: {
		id: 'dstAddrList',
		type: 'dropdown',
		label: 'Destination',
		isVisible: (options) => {
			return options.fromList
		},
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
		isVisible: (options) => {
			return !options.fromList
		},
	},
	gpInputAdder: {
		id: 'gpi',
		type: 'textinput',
		label: 'GPI',
		default: '1.2.3.4.5',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'GP Input address should be five period seperated integers <net>.<node>.<port>.<slot>.<gpio number>',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	gpSlotNumber: {
		id: 'gpSlotNumber',
		type: 'textinput',
		label: 'GP Slot & Number',
		default: '4.5',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'GP address should be two period seperated integers <slot>.<gpio number>',
		isVisible: (options) => {
			return options.fromList
		},
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
		regex: Regex.SOMETHING,
		tooltip:
			'Alias name for the given port which is displayed on the panel keys. A string with a maximum of 8 characters.',
	},
	portLabel: {
		id: 'portLabel',
		type: 'textinput',
		label: 'Port Label',
		default: '',
		useVariables: true,
		regex: Regex.SOMETHING,
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
		default: '-1',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Set to -1 when not used. Valid range 0 to 32.',
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
		regex: Regex.SOMETHING,
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
	cloneMethod: {
		id: 'cloneMethod',
		type: 'dropdown',
		label: 'Method',
		choices: choices.clone,
		default: rrcsMethods.portClone.start.rpc,
	},
	monitorAddr: {
		id: 'monitorAddr',
		type: 'textinput',
		label: 'Monitor Address',
		default: '1.2',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Address should be two period seperated integers <node>.<port>',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	cloneAddr: {
		id: 'cloneAddr',
		type: 'textinput',
		label: 'Clone Address',
		default: '1.2',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Address should be two period seperated integers <node>.<port>',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	monitorAddrList: {
		id: 'monitorAddrList',
		type: 'dropdown',
		label: 'Monitor Port',
		isVisible: (options) => {
			return options.fromList
		},
	},
	cloneAddrList: {
		id: 'cloneAddrList',
		type: 'dropdown',
		label: 'Clone Port',
		isVisible: (options) => {
			return options.fromList
		},
	},
	cloneInfo: {
		id: 'cloneInfo',
		type: 'static-text',
		label: '',
		value: 'Use Port 0.0 as a wildcard in order to stop a batch of port clones.',
		isVisible: (options) => {
			return options.cloneMethod === 'StopPortCloning'
		},
	},
	isInputClonePort: {
		id: 'isInputClonePort',
		type: 'checkbox',
		label: 'Input is Clone Port',
		default: false,
	},
	ifbMethod: {
		id: 'ifbMethod',
		type: 'dropdown',
		label: 'Method',
		choices: choices.ifb,
		default: rrcsMethods.ifbVolume.set.rpc,
	},
	ifbNumber: {
		id: 'ifbNumber',
		type: 'textinput',
		label: 'IFB Number',
		default: '1',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Refer to Director for IFB Number',
		isVisible: (options) => {
			return !options.fromList
		},
	},
	ifbList: {
		id: 'ifbList',
		type: 'dropdown',
		label: 'IFB Number',
		isVisible: (options) => {
			return options.fromList
		},
	},
	ifbVolume: {
		id: 'ifbVolume',
		type: 'textinput',
		label: 'Mix Minus Volume (dB)',
		default: '0',
		useVariables: true,
		regex: Regex.SOMETHING,
		tooltip: 'Range: -114.5 to +12.5, 0.5dB steps. Set to <= -115 to mute.',
		isVisible: (options) => {
			return options.ifbMethod === 'SetIFBVolumeMixMinus'
		},
	},
	ifbVolumeSetInfo: {
		id: 'ifbVolumeInfo',
		type: 'static-text',
		label: '',
		value:
			'Sets the mix minus volume for an IFB. It affects the single volume. If the mix minus and the output is assigned when SetIFBVolumeMixMinus is called, the volume for the crosspoint MixMinus->Output is set. If SetIFBVolumeMixMinus is called and a mix minus is not assigned, it will return an error. Presetting the volume is therefor not possible. If SetIFBVolumeMixMinus is called and an output is not assigned, the value is stored. Later when the output is assigned the crosspoint volume is set to the IFB volume. If an output is reassigned, it does not affect the IFB volume. When the mix minus is assigned the initial volume is always unity gain. If a mix minus is a group, the volumes for the group members can be set seperately and do not interfere with each other.',
		isVisible: (options) => {
			return options.ifbMethod === 'SetIFBVolumeMixMinus'
		},
	},
	ifbVolumeRemoveInfo: {
		id: 'ifbVolumeRemoveInfo',
		type: 'static-text',
		label: '',
		value: 'Removes the mix minus volume for an IFB. The volume returns to default (untiy gain).',
		isVisible: (options) => {
			return options.ifbMethod === 'RemoveIFBVolumeMixMinus'
		},
	},
	portDetails: {
		id: 'portDetails',
		type: 'multidropdown',
		label: 'Choices',
		choices: choices.portDetails,
		default: [choices.portDetails[0].id],
	},
}

export const objectParams = {
	portex: {
		type: {
			0: `TWO_WIRE_IN`,
			1: `TWO_WIRE_OUT`,
			2: `FOUR_WIRE`,
			3: `FOUR_WIRE_SPLIT`,
			4: `RCP_1012E`,
			5: `RCP_1028E`,
			6: `DCP_1016E`,
			7: `RCP_1112`,
			8: `RCP_1128`,
			9: `DCP_1116`,
			10: `CCP_1116`,
			11: `RSP_1232HL`,
			12: `RSP_1216HL`,
			13: `RCP_2016_DP4`,
			14: `DCP_2016_DP4`,
			15: `RCP_2116_P4`,
			16: `DCP_2116_P4`,
			17: `RSP_2318_PRO`,
			18: `RSP_2318_PLUS`,
			19: `RSP_2318_BASIC`,
			20: `DSP_2312_PLUS`,
			21: `DSP_2312_BASIC`,
			22: `RCP_3016_P4`,
			23: `DCP_3016_P4`,
			24: `DCP_5008`,
			25: `DCP_5108`,
			26: `DBM_1004E`,
			27: `TELEPHONE_CODEC`,
			28: `RIF_1032`,
			29: `RIF_2064`,
			30: `C3_BELTPACK`,
			31: `WB_2_BP`,
			32: `AURUS_PANEL`,
			33: `BOLERO_BP`,
			34: `TRUNKLINE`,
			35: `SIP`,
			36: `VCP_1004`,
			37: `VCP_1012`,
			38: `CodecConnection`,
		},
	},
}
