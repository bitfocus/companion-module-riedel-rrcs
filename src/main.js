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
		this.localXmlRpc = new XmlRpcServer(new HttpServerNodejs())
		await this.localXmlRpc.listen(this.config.portLocal, this.config.hostLocal)
		this.rrcsPri = new XmlRpcClient(`http://${this.config.hostPri}:${this.config.portPri}`)
		if (this.config.redundant) {
			this.rrcsSec = new XmlRpcClient(`http://${this.config.hostSec}:${this.config.portSec}`)
		}
		const ports = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'port'])
		console.log(`Ports: ${JSON.stringify(ports)}`)
		this.rrcs.ports = ports.ObjectList
		const conference = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'conference'])
		console.log(`Conferences: ${JSON.stringify(conference)}`)
		this.rrcs.conferences = conference.ObjectList
		const ifb = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'ifb'])
		console.log(`IFBs: ${JSON.stringify(ifb)}`)
		this.rrcs.ifbs = ifb.ObjectList
		const logicSource = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'logic-source'])
		console.log(`Logic Sources: ${JSON.stringify(logicSource)}`)
		this.rrcs.logicSrc = logicSource.ObjectList
		const logicDest = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'logic-destination'])
		console.log(`Logic Destinations: ${JSON.stringify(logicDest)}`)
		this.rrcs.logicDst = logicDest.ObjectList
		const gpInput = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'gp-input'])
		console.log(`GP Inputs: ${JSON.stringify(gpInput)}`)
		const gpOutput = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'gp-output'])
		console.log(`GP Outputs: ${JSON.stringify(gpOutput)}`)
		const users = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'user'])
		console.log(`Users: ${JSON.stringify(users)}`)
		this.rrcs.users = users.ObjectList
		const audioPatch = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'audiopatch'])
		console.log(`Audio Patch: ${JSON.stringify(audioPatch)}`)
		this.rrcs.audioPatch = audioPatch.ObjectList
		const clientCards = await this.rrcsPri.methodCall('GetObjectList', [this.returnTransKey(), 'client-card'])
		console.log(`Client Cards: ${JSON.stringify(clientCards)}`)
		this.rrcs.clientCards = clientCards.ObjectList
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
