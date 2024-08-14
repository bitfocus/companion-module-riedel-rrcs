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
				'Kill all crosspoints between the given source,destination. The method deletes only those crosspoints, which have been activated by RRCS.',
		},
		get: {
			rpc: 'GetXpStatus',
			name: 'Get Crosspoint Status',
			description:
				'Query status of XP source, destination Hint: The method can return trueeven if KillXp has been called beforehand.',
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
}
