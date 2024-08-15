import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import * as config from './config.js'
import * as localServer from './localserver.js'
import * as notifications from './notifications.js'
import { rrcsMethods } from './methods.js'
import * as transkey from './transKey.js'
import os from 'os'
import { XmlRpcClient } from '@foxglove/xmlrpc'
import PQueue from 'p-queue'

class Riedel_RRCS extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...localServer, ...notifications, ...transkey })
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
			crosspoint: [],
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
		
		this.rrcsPri = new XmlRpcClient(`http://${this.config.hostPri}:${this.config.portPri}`)
		this.rrcsPriQueue = new PQueue({ concurrency: 1 })
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
		const eventRegister = await this.rrcsPri.methodCall(rrcsMethods.notifications.registerForAllEvents.rpc, [
			this.returnTransKey(),
			this.config.portLocal,
			this.config.hostLocal,
			false,
			false,
		])
		console.log(`Event Registraton: ${eventRegister}`)
	}

	async init(config) {
		this.configUpdated(config)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		const unRegister = await this.rrcsPri.methodCall(rrcsMethods.notifications.unregisterForAllEvents.rpc, [
			this.returnTransKey(),
			this.config.portLocal,
			this.config.hostLocal,
		])
		this.destroyRRCS()
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
