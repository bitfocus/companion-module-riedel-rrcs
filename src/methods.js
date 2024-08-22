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
			rpc: 'GetAllLogicSources_v2',
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
		getCommandList: {
			rpc: 'GetCommandList',
			name: 'Get Command List',
			description: `Queries the list of configured command and all their properties of a given position. Position can be a key or virtual function or virtual key.`,
		},
		getPortsCommandLists: {
			rpc: 'GetPortsCommandLists',
			name: 'Get Ports Command Lists',
			description: `Queries the list of configured command and all their properties of all positions of a Port. Position can be a key or virtual function or virtual key.`,
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

	keyManipulations: {
		clearKeyLabel: {
			rpc: 'ClearKeyLabel',
			name: 'Key - Clear Label',
			description: 'Clears a key label that has been set before.',
		},
		clearKeyLabelAndMarker: {
			rpc: 'ClearKeyLabelAndMarker',
			name: 'Key - Clear Label & Marker',
			description: 'Clears a key label and marker that has been set before.',
		},
		clearKeyMarker: {
			rpc: 'ClearKeyMarker',
			name: 'Key - Clear Marker',
			description: 'Clears a marker that has been set before.',
		},
		getRemoteKey: {
			rpc: 'GetRemoteKey',
			name: 'Get Remote Key',
			description: 'Queries key manipulations for the given key.',
		},
		getAllRemoteKeys: {
			rpc: 'GetAllRemoteKeys',
			name: 'Get All Remote Keys',
			description: 'Queries all key manipulations that have been sent via RRCS with one the functions in this section.',
		},
		lockKey: {
			rpc: 'LockKey',
			name: 'Key - Lock',
			description: 'Locks a key, so the user cannot press it.',
		},
		pressKey: {
			rpc: 'PressKey',
			name: 'Key - Press',
			description: 'Presses a key.',
		},
		pressKeyEx: {
			rpc: 'PressKeyEx',
			name: 'Key - Press',
			description:
				'On 1200 series panels Primary Trigger is the Lever-Down, Secondary Lever-Up, whilst on a 1000/1100 series Panel it is Left- or rather Right-Key. On all other panel types only the Primary Trigger is supported.',
		},
		setKeyLabel: {
			rpc: 'SetKeyLabel',
			name: 'Key - Set Label',
			description:
				'Sets a key label. It overwrites any other key label of the configuration. {Label} is a 8 character string.',
		},
		setKeyLabelAndMarker: {
			rpc: 'SetKeyLabelAndMarker',
			name: 'Key - Set Label & Marker',
			description:
				'Sets a key label and a marker . {Label} is a 8 character string. {Marker} is the index of the marker in the configuration. See the net properties dialog in Director.',
		},
		setKeyMarker: {
			rpc: 'SetKeyMarker',
			name: 'Key - Set Marker',
			description:
				'Sets a marker above the key. {Marker} is the index of the marker in the configuration. See the net properties dialog in Director.',
		},
	},
	portClone: {
		start: {
			rpc: 'StartPortCloning',
			name: 'Start Port Clone',
			description: 'Clones the output signal of a port and routes all audios to a monitoring port.',
		},
		stop: {
			rpc: 'StopPortCloning',
			name: 'Stop Port Clone',
			description: 'Stops cloneing. Use Port 0.0 as a wildcard in order to stop a batch of port clones.',
		},
		getAll: {
			rpc: 'GetAllActivePortClones',
			name: 'Get All Active Port Clones',
			description: 'Returns an array of all active port clones.',
		},
	},
	ifbVolume: {
		set: {
			rpc: 'SetIFBVolumeMixMinus',
			name: 'Set IFB Volume Mix Minus',
			description: 'Sets the mix minus volume for an IFB. It affects the single volume.',
		},
		get: {
			rpc: 'GetIFBVolumeMixMinus',
			name: 'Get IFB Volume Mix Minus',
			description:
				'Returns the the mix minus volume for an IFB. If the volume was never set by SetIFBVolumeMixMinus, the return value is unity gain.',
		},
		remove: {
			rpc: 'RemoveIFBVolumeMixMinus',
			name: 'Remove IFB Volume Mix Minus',
			description: 'Removes the mix minus volume for an IFB. The volume returns to default (untiy gain).',
		},
	},
	call: {
		dial: {
			rpc: 'DialNumber',
			name: 'Dial Number',
			description: 'Instructs the system to dial the specified number.',
		},
		hangUp: {
			rpc: 'HangUpCall',
			name: 'Hang Up Call',
			description: 'Instructs the system to draw the call.',
		},
		lineStatus: {
			rpc: 'LineStatus',
			name: 'Line Status',
			description: 'Queries information about the status of the line.',
		},
	},
	connectionManagement: {
		connect: {
			rpc: 'ConnectToArtist',
			name: 'Connect To Artist',
			description:
				'Disconnects from current connected Artist System, if necessary, and connects to the specified IPAddress.',
		},
		disconnect: {
			rpc: 'DisconnectFromArtist',
			name: 'Disconnect From Artist',
			description: 'Disconnects from current connected Artist System.',
		},
	},
	reset: {
		allNodes: {
			rpc: 'ResetAllNodes',
			name: 'Reset All Nodes',
			description: 'Resets all nodes that are online within the ring.',
		},
	},
	deletePort: {
		deletePortCommands: {
			rpc: 'DeletePortCommands',
			name: 'Delete Port Commands',
			description: 'Deletes all commands of the specified command position.',
		},
	},
	systemTime: {
		setSystemTimeOnAllNodes: {
			rpc: 'SetSystemTimeOnAllNodes',
			name: 'Delete Port Commands',
			description: 'Returns the amount of currently online nodes and the amount of updated nodes.',
		},
	},
	poolPort: {
		getPoolPortInfo: {
			rpc: 'GetPoolPortInfo',
			name: 'Get Pool Port Info',
			description: 'Returns PoolPort information regarding a specific port.',
		},
	},
	license: {
		getInfo: {
			rpc: 'GetLicenseInfo',
			name: 'Get License Info',
			description: 'Returns the license information.',
		},
	},
	panelSpy: {
		changeRegistry: {
			rpc: 'ChangePanelSpyRegistry',
			name: 'Change Panel Spy Registry',
			description:
				'Starts/Stops panel spy notifications. Hint: The method fails, if RegisterForAllEvents has not been called.',
		},
	},
	trunking: {
		getPorts: {
			rpc: 'GetTrunkPorts',
			name: 'Get Trunk Ports',
			description: 'Queries all trunking ports.',
		},
		getSetup: {
			rpc: 'GetTrunklineSetup',
			name: 'Get Trunkline Setup',
			description: 'Queries setup information about Trunklines exist between the Riedel rings.',
		},
		getActivities: {
			rpc: 'GetTrunklineActivities',
			name: 'Get Trunkline Activities',
			description: 'Queries activity information of trunklines.',
		},
		getIfbs: {
			rpc: 'GetTrunkIfbs',
			name: 'Get Trunk IFBs',
			description: 'Queries all trunking ifbs.',
		},
		updateLabels: {
			rpc: 'UpdateTrunkingLabels',
			name: 'Update Trunking Labels',
			description: 'Updates the labels of trunked ports.',
		},
		getNetAddr: {
			rpc: 'GetTrunkingNetAddr',
			name: 'Get Trunking Net Address',
			description: 'Gets the Trunking Net address of the ring.',
		},
		setNetAddr: {
			rpc: 'SetTrunkingNetAddr',
			name: 'Set Trunking Net Address',
			description: 'Sets the Trunking Net address of the ring.',
		},
		getLTC: {
			rpc: 'GetLTC',
			name: 'Get Local Trunk Controller',
			description: 'Gets the current configured local trunk controller.',
		},
		setLTC: {
			rpc: 'SetLTC',
			name: 'Set Local Trunk Controller',
			description: 'Sets the local trunk controller.',
		},
	},
}
