import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import * as alias from './alias.js'
import * as clone from './clone.js'
import * as config from './config.js'
import * as crosspoints from './crosspoints.js'
import * as debounce from './debounce.js'
import * as gain from './gain.js'
import * as gpio from './gpio.js'
import * as ifb from './ifb.js'
import * as keyManipulation from './keyManipulation.js'
import * as localServer from './localserver.js'
import * as logic from './logic.js'
import * as notifications from './notifications.js'
import { rrcsMethods } from './methods.js'
import * as methodCallQueue from './methodCallQueue.js'
import * as portLabel from './portLabel.js'
import * as ports from './ports.js'
import * as string from './string.js'
import * as utils from './utils.js'
import * as volume from './volume.js'
import os from 'os'
import { XmlRpcClient } from '@foxglove/xmlrpc'
import PQueue from 'p-queue'

class Riedel_RRCS extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, {
			...alias,
			...clone,
			...config,
			...crosspoints,
			...debounce,
			...gain,
			...gpio,
			...ifb,
			...keyManipulation,
			...localServer,
			...logic,
			...methodCallQueue,
			...notifications,
			...portLabel,
			...ports,
			...string,
			...utils,
			...volume,
		})
		this.localIPs = []
		this.feedbacksToUpdate = []
		const interfaces = os.networkInterfaces()
		const interface_names = Object.keys(interfaces)
		interface_names.forEach((nic) => {
			interfaces[nic].forEach((ip) => {
				if (ip.family == 'IPv4') {
					this.localIPs.push({ id: ip.address, label: `${nic}: ${ip.address}` })
				}
			})
		})
	}

	destroyRRCS() {
		this.rrcsQueue.clear()

		if (this.rrcs) {
			delete this.rrcs
		}
		if (this.localXmlRpcPri) {
			this.localXmlRpcPri.close()
			delete this.localXmlRpcPri
		}
		if (this.localXmlRpcSec) {
			this.localXmlRpcSec.close()
			delete this.localXmlRpcSec
		}
		if (this.rrcsPri) {
			delete this.rrcsPri
		}
		if (this.rrcsSec) {
			delete this.rrcsSec
		}
	}

	async initRRCS() {
		this.destroyRRCS()
		this.rrcs = {
			activeServer: 'pri',
			crosspoints: {},
			ports: {},
			conferences: [],
			ifbs: [],
			logicSrc: [],
			logicDst: [],
			gpInputs: [],
			gpOutputs: [],
			users: [],
			audioPatch: [],
			clientCards: [],
			choices: {
				ifbs: [],
				logicSources: [],
				ports: {
					inputs: [],
					outputs: [],
					panels: [],
					all: [],
				},
			},
		}

		this.rrcsPri = new XmlRpcClient(`http://${this.config.hostPri}:${this.config.portPri}`)
		await this.initLocalServer(this.config.portLocalPri, this.config.hostLocalPri, `localXmlRpcPri`)
		if (this.config.redundant) {
			if (this.config.hostSec && this.config.portSec && this.config.hostLocalSec) {
				this.rrcsSec = new XmlRpcClient(`http://${this.config.hostSec}:${this.config.portSec}`)
				await this.initLocalServer(this.config.portLocalSec, this.config.hostLocalSec, `localXmlRpcSec`)
			} else {
				this.updateStatus(InstanceStatus.BadConfig)
				return
			}
		}

		this.rrcsQueue.add(() =>
			this.rrcsMethodCall(
				rrcsMethods.notifications.registerForAllEvents.rpc,
				[parseInt(this.config.portLocalPri), this.config.hostLocalPri, false, false],
				'pri'
			)
		)
		this.getAllXp()
		this.getAllLogicSources()
		this.getAllPorts()
		this.getAllIFBs()
		this.debounceUpdateFeedbacks()
	}

	async init(config) {
		this.rrcsQueue = new PQueue({ concurrency: 1, interval: 5, intervalCap: 1 })
		this.configUpdated(config)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		this.stopDebounce()
		this.rrcsQueue.clear()
		this.rrcsMethodCall(
			rrcsMethods.notifications.unregisterForAllEvents.rpc,
			[this.config.portLocalPri, this.config.hostLocalPri],
			'pri'
		)
		if (this.rrcsSec) {
			this.rrcsMethodCall(
				rrcsMethods.notifications.unregisterForAllEvents.rpc,
				[this.config.portLocalSec, this.config.hostLocalSec],
				'sec'
			)
		}
		this.destroyRRCS()
	}

	async configUpdated(config) {
		this.config = config
		this.rrcsQueue.clear()
		if (this.config.hostPri && this.config.portPri) {
			this.updateStatus(InstanceStatus.Connecting)
			this.initRRCS()
			this.updateVariableDefinitions() // export variable definitions
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	handleStartStopRecordActions(isRecording) {
		this.isRecordingActions = isRecording
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(Riedel_RRCS, UpgradeScripts)
