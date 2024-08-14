import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import * as config from './config.js'
import * as transkey from './transKey.js'
import os from 'os'
import { XmlRpcFault, XmlRpcServer, XmlRpcClient } from '@foxglove/xmlrpc'
import { HttpServerNodejs } from '@foxglove/xmlrpc/nodejs'
import { serverCallbacks } from './callbacks.js'

class Riedel_RRCS extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...transkey })
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
		this.localXmlRpc = new XmlRpcServer(new HttpServerNodejs())
		await this.localXmlRpc.listen(this.config.portLocal, this.config.hostLocal)
		this.rrcsPri = new XmlRpcClient(`http://${this.config.hostPri}:${this.config.portPri}`)
		if (this.config.redundant) {
			this.rrcsSec = new XmlRpcClient(`http://${this.config.hostSec}:${this.config.portSec}`)
		}
		const ports = await this.rrcsPri.methodCall("GetObjectList", [this.returnTransKey(), 'port'])
		console.log(`Ports: ${JSON.stringify(ports)}`)
	}

	async init(config) {
		this.configUpdated(config)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		this.destroyRRCS()
	}

	async configUpdated(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)
		this.initRRCS()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
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
