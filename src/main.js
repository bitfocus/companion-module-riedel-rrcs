import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import * as config from './config.js'
import * as crosspoints from './crosspoints.js'
import * as localServer from './localserver.js'
import * as notifications from './notifications.js'
import { rrcsMethods } from './methods.js'
import * as methodCallQueue from './methodCallQueue.js'
import * as transkey from './transKey.js'
import os from 'os'
import { XmlRpcClient } from '@foxglove/xmlrpc'
import PQueue from 'p-queue'

class Riedel_RRCS extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, {
			...config,
			...crosspoints,
			...localServer,
			...methodCallQueue,
			...notifications,
			...transkey,
		})
		this.localIPs = []
		let interfaces = os.networkInterfaces()
		let interface_names = Object.keys(interfaces)
		interface_names.forEach((nic) => {
			interfaces[nic].forEach((ip) => {
				if (ip.family == 'IPv4') {
					this.localIPs.push({ id: ip.address, label: `${nic}: ${ip.address}` })
				}
			})
		})
	}

	destroyRRCS() {
		if (this.rrcs) {
			delete this.rrcs
		}
		if (this.localXmlRpc) {
			this.localXmlRpc.close()
			delete this.localXmlRpc
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
			crosspoints: {},
			ports: [],
			conferences: [],
			ifbs: [],
			logicSrc: [],
			logicDst: [],
			gpInputs: [],
			gpOutputs: [],
			users: [],
			audioPatch: [],
			clientCards: [],
		}
		this.rrcsQueue = new PQueue({ concurrency: 1 })

		this.rrcsPri = new XmlRpcClient(`http://${this.config.hostPri}:${this.config.portPri}`)

		if (this.config.redundant) {
			if (this.config.hostSec && this.config.portSec) {
				this.rrcsSec = new XmlRpcClient(`http://${this.config.hostSec}:${this.config.portSec}`)
				this.rrcsSecQueue = new PQueue({ concurrency: 1 })
			} else {
				this.updateStatus(InstanceStatus.BadConfig)
				return
			}
		}
		await this.initLocalServer(this.config.portLocal, this.config.hostLocal)
		this.rrcsQueue.add(() =>
			this.rrcsMethodCall(rrcsMethods.notifications.registerForAllEvents.rpc, [
				this.config.portLocal,
				this.config.hostLocal,
				false,
				false,
			])
		)
	}

	async init(config) {
		this.configUpdated(config)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		this.rrcsQueue.add(() =>
			this.rrcsMethodCall(rrcsMethods.notifications.unregisterForAllEvents.rpc, [
				this.config.portLocal,
				this.config.hostLocal,
			])
		)
		this.rrcsQueue.on('idle', () => {
			this.destroyRRCS()
		})
	}

	async configUpdated(config) {
		this.config = config
		if (this.config.hostPri && this.config.portPri) {
			this.updateStatus(InstanceStatus.Connecting)
			this.initRRCS()
			this.updateActions() // export actions
			this.updateFeedbacks() // export feedbacks
			this.updateVariableDefinitions() // export variable definitions
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
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
