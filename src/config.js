import { Regex } from '@companion-module/base'
import { default_port } from './consts.js'

// Return config fields for web config
export function getConfigFields() {
	return [
		{
			type: 'checkbox',
			id: 'redundant',
			label: 'Redundant RRCS Cluster',
			default: false,
			width: 6,
			isVisible: () => {
				return false
			},
		},
		{
			type: 'textinput',
			id: 'hostPri',
			label: 'Primary RRCS Hostname',
			width: 12,
			regex: Regex.HOSTNAME,
			default: '',
		},
		{
			type: 'textinput',
			id: 'portPri',
			label: 'Primary RRCS Port',
			width: 6,
			regex: Regex.PORT,
			default: default_port,
			tooltip: `Default, TCP:${default_port}`,
		},
		{
			type: 'textinput',
			id: 'hostSec',
			label: 'Secondary RRCS Hostname',
			width: 12,
			default: '',
			regex: Regex.HOSTNAME,
			isVisible: (options) => {
				return options.redundant
			},
		},
		{
			type: 'static-text',
			id: 'place-holder-1',
			label: '',
			value: '',
			width: 12,
			isVisible: (options) => {
				return !options.redundant
			},
		},
		{
			type: 'textinput',
			id: 'portSec',
			label: 'Secondary RRCS Port',
			width: 6,
			regex: Regex.PORT,
			default: default_port,
			tooltip: `Default, TCP:${default_port}`,
			isVisible: (options) => {
				return options.redundant
			},
		},
		{
			type: 'static-text',
			id: 'place-holder-2',
			label: '',
			value: '',
			width: 6,
			isVisible: (options) => {
				return !options.redundant
			},
		},
		{
			type: 'dropdown',
			id: 'hostLocalPri',
			label: 'Local Interface for Primary RPC Server',
			width: 12,
			choices: this.localIPs,
			allowCustom: true,
			regex: Regex.HOSTNAME,
			tooltip: 'The interface on this machine that the Primary RRCS server will send messages to',
		},
		{
			type: 'textinput',
			id: 'portLocalPri',
			label: 'Local Port Primary',
			width: 6,
			regex: Regex.PORT,
			default: 8195,
			tooltip: `Port for the local XML-RPC server`,
		},
		{
			type: 'dropdown',
			id: 'hostLocalSec',
			label: 'Local Interface for Secondary RPC Server',
			width: 12,
			choices: this.localIPs,
			allowCustom: true,
			regex: Regex.HOSTNAME,
			tooltip: 'The interface on this machine that the Secondary RRCS server will send messages to',
			isVisible: (options) => {
				return options.redundant
			},
		},
		{
			type: 'number',
			id: 'portLocalSec',
			label: 'Local Port Secondary',
			width: 6,
			regex: Regex.PORT,
			default: 8196,
			tooltip: `Port for the local XML-RPC server`,
			isVisible: (options) => {
				return options.redundant
			},
		},
		{
			type: 'static-text',
			id: 'place-holder-3',
			label: '',
			value: '',
			width: 12,
			isVisible: (options) => {
				return !options.redundant
			},
		},
		{
			type: 'static-text',
			id: 'place-holder-4',
			label: '',
			value: '',
			width: 6,
			isVisible: (options) => {
				return !options.redundant
			},
		},
		{
			type: 'checkbox',
			id: 'witness',
			label: 'Witness',
			default: false,
			width: 6,
			tooltip: 'Manage redundacy between primary and secondary RRCS server. Only 1 witness should be configured',
			isVisible: (options) => {
				return options.redundant
			},
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Verbose Logs',
			default: false,
			width: 6,
		},
	]
}
