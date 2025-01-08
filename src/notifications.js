export const notifications = {
	string: {
		send: {
			rpc: 'SendString',
			name: 'Send String',
			description: `Dump/send string notification. It is sent when the Send String command is executed in the system.`,
		},
		sendOff: {
			rpc: 'SendStringOff',
			name: 'Send String Off',
			description: `Dump/send string off notification. It is sent when the Send String command is executed in the system.`,
		},
	},
	gpio: {
		inputChange: {
			rpc: 'GpInputChange',
			name: 'GP Input Change',
			description: `Notification for a GP input change.`,
		},
		outputChange: {
			rpc: 'GpOutputChange',
			name: 'GP Output Change',
			description: `Notification for a GP output change.`,
		},
	},
	logic: {
		sourceChange: {
			rpc: 'LogicSourceChange',
			name: 'Logic Source Change',
			description: `Notification for a Logic Source state change.`,
		},
	},
	volume: {
		xpChange: {
			rpc: 'XpVolumeChange',
			name: 'Crosspoint Volume Change',
			description: `Notification for crosspoint volume change.`,
		},
	},
	configuration: {
		change: {
			rpc: 'ConfigurationChange',
			name: 'Configuration Change',
			description: `Notification for a configuration change.`,
		},
	},
	crosspoint: {
		change: {
			rpc: 'CrosspointChange',
			name: 'Crosspoint Change',
			description: `Notification for a crosspoint change.`,
		},
	},
	alarms: {
		upstreamFailed: {
			rpc: 'UpstreamFailed',
			name: 'Upstream Failed',
			description: `Upstream failed on Node.`,
		},
		upstreamFailedCleared: {
			rpc: 'UpstreamFailedCleared',
			name: 'Upstream Failed Cleared',
			description: `Upstream failed cleared on Node.`,
		},
		downstreamFailed: {
			rpc: 'DownstreamFailed',
			name: 'Downstream Failed',
			description: `Downstream failed on Node.`,
		},
		downstreamFailedCleared: {
			rpc: 'DownstreamFailedCleared',
			name: 'Downstream Failed Cleared',
			description: `Downstream failed cleared on Node.`,
		},
		nodeControllerFailed: {
			rpc: 'NodeControllerFailed',
			name: 'Node Controller Failed',
			description: `Node controller failed on Node.`,
		},
		nodeControllerReboot: {
			rpc: 'NodeControllerReboot',
			name: 'Node Controller Failed',
			description: `Node controller reboot on Node.`,
		},
		clientFailed: {
			rpc: 'ClientFailed',
			name: 'Client Failed',
			description: `Client failed on Node.`,
		},
		clientFailedCleared: {
			rpc: 'ClientFailedCleared',
			name: 'Client Failed Cleared',
			description: `Client failed cleared on Node.`,
		},
		portInactive: {
			rpc: 'PortInactive',
			name: 'Port Inactive',
			description: `Port went inactive.`,
		},
		portActive: {
			rpc: 'PortActive',
			name: 'Port Active',
			description: `Port went active.`,
		},
		connectArtistRestored: {
			rpc: 'ConnectArtistRestored',
			name: 'Artist Connection Restored',
			description: `Connect to Artist net succesful after failure.`,
		},
		connectArtistFailure: {
			rpc: 'ConnectArtistFailure',
			name: 'Artist Connection Failure',
			description: `Connect to Artist net failure.`,
		},
		gatewayShutdown: {
			rpc: 'GatewayShutdown',
			name: 'Gateway Shutdown',
			description: `Gateway shutdown due to application closure or PC shutdown.`,
		},
		sicFailed: {
			rpc: 'SICFailed',
			name: 'SIC Failed',
			description: `SIC failed on Artist-1024.`,
		},
	},
	ping: {
		getAlive: {
			rpc: 'GetAlive',
			name: 'Get Alive',
			description: `Ping.`,
		},
	},
}
