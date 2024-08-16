import { InstanceStatus } from '@companion-module/base'

export async function rrcsMethodCall(method, params) {
	let data
	try {
		if (this.config.verbose) {
			this.log('debug', `Initating Method Call: ${method}\nParameters: ${params}`)
		}
		if (this.rrcsPri) {
			data = await this.rrcsPri.methodCall(method, [this.returnTransKey(), ...params])
			if (this.config.verbose) {
				this.log('debug', `Response to Method Call: ${method}\nData: ${JSON.stringify(params)}`)
			}
			this.updateStatus(InstanceStatus.Ok)
		} else {
			this.log('warn', `No RRCS Server. Tried to send ${method} ${params}`)
			this.updateStatus(InstanceStatus.BadConfig, `No server`)
			data = undefined
		}
	} catch (error) {
		this.log('warn', `Error! \n ${JSON.stringify(error)}`)
		data = undefined
		this.updateStatus(InstanceStatus.ConnectionFailure, JSON.stringify(error))
	}

	return data
}
