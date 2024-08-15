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
			id: 'hostLocal',
			label: 'Local Interface',
			width: 12,
			choices: this.localIPs,
			allowCustom: true,
			regex: Regex.HOSTNAME,
			tooltip: 'The interface on this machine that RRCS will send messages to',
		},
		{
			type: 'textinput',
			id: 'portLocal',
			label: 'Local Port',
			width: 6,
			regex: Regex.PORT,
			default: 8999,
			tooltip: `Port for the local XML-RPC server`,
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
