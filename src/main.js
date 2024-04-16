const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const config = require('./config.js')
const os = require('os')
const { RRCS_Server, RRCS_Client} = require('riedel_rrcs')
const { serverCallbacks } = require('./callbacks.js')

class Riedel_RRCS extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config })
		this.localIPs =[]
		let interfaces = os.networkInterfaces()
		let interface_names = Object.keys(interfaces)
		interface_names.forEach((nic) => {
			interfaces[nic].forEach((ip) => {
				if (ip.family == 'IPv4'){
					this.localIPs.push({id: ip.address, label: `${nic}: ${ip.address}`})
				}
			})
		})
	}

	destroyRRCS() {
		if (this.rrcs_server_pri) {
			delete this.rrcs_server_pri
		}
		if (this.rrcs_server_sec) {
			delete this.rrcs_server_sec
		}
		if (this.rrcs_client_pri) {
			delete this.rrcs_client_pri
		}
		if (this.rrcs_client_sec) {
			delete this.rrcs_client_sec
		}
	}

	initRRCS(){
		this.destoryRRCS()
		let local = {ip: this.config.localIP, port: this.config.localPort}
		let remote_pri = {ip: this.config.hostPri, port: this.config.portPri}
		let remote_sec = {ip: this.config.hostSec, port: this.config.portSec}
		this.rrcs_server_pri = new RRCS_Server(local, remote_pri, serverCallbacks)
		this.rrcs_client_pri = new RRCS_Client(this.config.hostPri, this.config.portPri)
		if (this.config.redundant) {
			this.rrcs_server_sec = new RRCS_Server(local, remote_sec, serverCallbacks)
			this.rrcs_client_sec = new RRCS_Client(this.config.hostSec, this.config.portSec)
		}
	}

	async init(config) {
		this.config = config
		
		this.updateStatus(InstanceStatus.Connecting)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		this.destoryRRCS()
	}

	async configUpdated(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)
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
