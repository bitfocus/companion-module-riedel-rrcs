//import { notifications } from './notifications.js'

export const rrcsMethods = {
	crosspoint: {
		set: {
			rpc: 'SetXp',
			name: 'Set Crosspoint',
			description: 'Activate XP source, destination. With standard priority',
		},
		setPrio: {
			rpc: 'SetXpPrio',
			name: 'Set Crosspoint with Priority',
			description: 'Activate XP source, destination, Priority',
		},
		setDestruct: {
			rpc: 'SetXpDestructive',
			name: 'Set Crosspoint with Priority, Destructive',
			description:
				'Activate XP source, destination with audio priority. An existing route to the given destination will be removed. The values Net = 0, Node = 0, port = 0 remove all existing routes for the given source or destination.',
		},
		kill: {
			rpc: 'KillXp',
			name: 'Kill Crosspoint',
			description:
				'Kill all crosspoints between the given source, destination. The method deletes only those crosspoints, which have been activated by RRCS.',
		},
		get: {
			rpc: 'GetXpStatus',
			name: 'Get Crosspoint Status',
			description:
				'Query status of XP source, destination Hint: The method can return trueeven if KillXp has been called beforehand.',
		},
		getAllActive: {
			rpc: 'GetAllActiveXps',
			name: 'Get All Active Crosspoints',
			description: 'Dump active XPs.',
		},
		getActiveXpsRange: {
			rpc: 'GetActiveXpsRange',
			name: 'Dump Active Crosspoints',
			description:
				'Dumps active crosspoints for the given range. A crosspoint is in range, if the source or (changed in specification version 1.4) the destination of the crosspoint is in range (Start Net <= xp-net <= Stop Net Start Node <= xp-node <= Stop Node Start Port <= xp-port <= Stop Port)',
		},
	},
	volume: {
		setXp: {
			rpc: 'SetXpVolume',
			name: 'Set Crosspoint Volume',
			description: `Sets the single or/and conference volume. This API does not work for XPs whose destination port is connected to an Artist-1024`,
		},
		getXp: {
			rpc: 'GetXpVolume',
			name: 'Get Crosspoint Volume',
			description: `Queries the single or/and conference volume. This API does not work for XPs whose destination port is connected to an Artist-1024`,
		},
	},
	portAlias: {
		set: {
			rpc: 'SetPortAlias',
			name: 'Set Port Alias',
			description: `Set the alias for the given port.`,
		},
		get: {
			rpc: 'GetPortAlias',
			name: 'Get Port Alias',
			description: `Queries the alias for the given port.`,
		},
	},
	portLabel: {
		set: {
			rpc: 'SetPortLabel',
			name: 'Set Port Label',
			description: `Set the label for the given port.`,
		},
		get: {
			rpc: 'GetPortLabel',
			name: 'Get Port Label',
			description: `Queries the label for the given port.`,
		},
	},
	gain: {
		setInput: {
			rpc: 'SetInputGain',
			name: 'Set Input Gain',
			description: `Set input gain of port.`,
		},
		getInput: {
			rpc: 'GetInputGain',
			name: 'Get Input Gain',
			description: `Query input gain of port.`,
		},
		setOutput: {
			rpc: 'SetOutputGain',
			name: 'Set Output Gain',
			description: `Set output gain of port.`,
		},
		getOutput: {
			rpc: 'GetOutputGain',
			name: 'Get Output Gain',
			description: `Query output gain of port.`,
		},
		getLevelMeter: {
			rpc: 'GetLevelMeterValues',
			name: 'Get Input Level Meters',
			description: `Queries the level meter values. For Artist-1024 connected ports, RRCS must be connected directly to the same SIC.`,
		},
	},
	gpio: {
		setGPO: {
			rpc: 'SetGpOutput',
			name: 'Set GP Output',
			description: `Activates/Deactivates the given GP output. The method deactivates only GP outputs that have been activated by RRCS.`,
		},
		getGPI: {
			rpc: 'GetGpInputState',
			name: 'Get GP Input',
			description: `Queries the given GP input state.`,
		},
		getGPO: {
			rpc: 'GetGpOutputState',
			name: 'Get GP Output',
			description: `Queries the given GP output state. The method can return true, even if the GP output has been deactivated by “SetGpOutput “`,
		},
	},
	logic: {
		setSource: {
			rpc: 'SetLogicSourceState',
			name: 'Set Logic Source State',
			description: `Activates/Deactivates the given logic source. The method deactivates only logic sources that have been activated by RRCS.`,
		},
		getAllSources: {
			rpc: 'GetAllLogicSources',
			name: 'Get All Logic Sources',
			description: `Queries all logic sources in the system.`,
		},
		getAllSourcesV2: {
			rpc: 'GetAllLogicSources',
			name: 'Get All Logic Sources (V2)',
			description: `Queries all logic sources in the system including the current state.`,
		},
	},
	status: {
		getAllCaps: {
			rpc: 'GetAllCaps',
			name: 'Get All Caps',
			description: `Queries all ports in the system.`,
		},
		getAllPorts: {
			rpc: 'GetAllPorts',
			name: 'Get All Ports',
			description: `Queries all ports in the system with more detailed information than 'GetAllCaps'.`,
		},
		getPort: {
			rpc: 'GetPort',
			name: 'Get Port',
			description: `Queries all properties of the specified port.`,
		},
		getPortExTypeList: {
			rpc: 'GetPortExTypeList',
			name: 'Get Port Ex Type List',
			description: `Queries all supported port types that can be used on the CfgChange→PortEx API.`,
		},
		getAllIFBs: {
			rpc: 'GetAllIFBs',
			name: 'Get All IFBs',
			description: `Queries all IFB's in Artist.`,
		},
		getAllConferences: {
			rpc: 'GetAllConferences',
			name: 'Get All Conferences',
			description: `Returns a list of all configured conferences including all their property values.`,
		},
		getAllGroups: {
			rpc: 'GetAllGroups',
			name: 'Get All Groups',
			description: `Returns a list of all configured groups including all their property values.`,
		},
		getAllDevices: {
			rpc: 'GetAllDevices',
			name: 'Get All Devices',
			description: `Returns a list of all configured Devices.`,
		},
		getAllKeyConfigurations: {
			rpc: 'GetAllKeyConfigurations',
			name: 'Get All Key Configurations',
			description: `Returns a list of all key configurations of a Port, including all their property values. Also includes virtual-keys. Note: 'IsInput' and 'PoolPort' are optional parameters.`,
		},
		getErrorCodeList: {
			rpc: 'GetErrorCodeList',
			name: 'Get Error Code List',
			description: `Get a list of possible error codes including their error descriptions.`,
		},
		getState: {
			rpc: 'GetState',
			name: 'Get Gateway State',
			description: `Query gateway state.`,
		},
		setStateWorking: {
			rpc: 'SetStateWorking',
			name: 'Set Gateway State to Working',
			description: `Set gateway to working.`,
		},
		setStateStandby: {
			rpc: 'SetStateStandby',
			name: 'Set Gateway State to Standby',
			description: `Set gateway to standby.`,
		},
		getAlive: {
			rpc: 'GetAlive',
			name: 'Ping Gateway',
			description: `Ping the gateway.`,
		},
		getVersion: {
			rpc: 'GetVersion',
			name: 'Get RRCS Version',
			description: `Retreive the RRCS version.`,
		},
		isConnectedToArtist: {
			rpc: 'IsConnectedToArtist',
			name: 'Is Connected to Artist',
			description: `Tests whether RRCS is connected to Artist or not.`,
		},
		isRegisteredForEvents: {
			rpc: 'IsRegisteredForEvents',
			name: 'Is Registered for Events',
			description: `Tests whether the RRCS sends notifications to the given XML-RPC server or not.`,
		},
		isRegisteredForAllEvents: {
			rpc: 'IsRegisteredForAllEvents',
			name: 'Is Registed for All Events',
			description: `Tests whether RRCS sends notifications to the given address or not. Internally the method tests whether RRCS sends notifications to the url ("http://" [ip-address of incoming RPC] ":" [TCPPort] [URLPath]) or not. The url path is optional and is treated as “/RPC2” if left blank.`,
		},
		getNetName: {
			rpc: 'GetNetName',
			name: 'Get Net Name',
			description: `Returns the long name of the Net.`,
		},
		setNetName: {
			rpc: 'SetNetName',
			name: 'Set Net Name',
			description: `Sets the long name of the Net.`,
		},
	},
	objects: {
		getList: {
			rpc: 'GetObjectList',
			name: 'Get Object List',
			description: `Gets all existing objects in the system of a specific type.`,
			choices: [
				{ id: 'conference', label: 'Conference' },
				{ id: 'group', label: 'Group' },
				{ id: 'port', label: 'Port' },
				{ id: 'ifb', label: 'IFB' },
				{ id: 'logic-source', label: 'Logic Source' },
				{ id: 'logic-destination', label: 'Logic destination' },
				{ id: 'gp-input', label: 'GP Input' },
				{ id: 'gp-output', label: 'GP Output' },
				{ id: 'user', label: 'User' },
				{ id: 'audiopatch', label: 'Audiopatch' },
				{ id: 'client-card', label: 'Client Card' },
				{ id: 'device', label: 'Device' },
			],
		},
		getProperty: {
			rpc: 'GetObjectProperty',
			name: 'Get Object Property',
			description: `Gets an object property.`,
		},
		getPropertyNames: {
			rpc: 'GetObjectPropertyNames',
			name: 'Get Object Property Names',
			description: `Gets a list of supported object properties.`,
		},
	},
	notifications: {
		registerForAllEvents: {
			rpc: 'RegisterForAllEvents',
			name: 'Register For All Events',
			description: `Allows to receive any RRCS event. RRCS will send events to calling the computer with the given TCP-port.`,
		},
		unregisterForAllEvents: {
			rpc: 'UnregisterForAllEvents',
			name: 'Unregister For All Events',
			description: `Unregisters a single event receiver for all change notifications.`,
		},
	},
}
