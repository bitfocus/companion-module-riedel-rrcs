import { InstanceStatus } from '@companion-module/base'

export async function rrcsMethodCall(method, params, server) {
	let data
	try {
		if (this.config.verbose) {
			this.log(
				'debug',
				`Initating Method Call: ${method}\nParameters: ${params} to ${server || this.rrcs.activeServer}`,
			)
		}
		const transKey = this.returnTransKey()
		if (this.rrcsSec && (server === 'sec' || this.rrcs.activeServer === 'sec') && server !== 'pri') {
			data = await this.rrcsSec.methodCall(method, [transKey, ...params])
			if (this.config.verbose) {
				this.log(
					'debug',
					`RRCS Secondary Server Response to Method Call: ${method}\nTransaction Key: ${transKey} Data: ${JSON.stringify(
						params,
					)}`,
				)
			}
			//this.updateStatus(InstanceStatus.Ok)
		} else if (this.rrcsPri && server !== 'sec') {
			data = await this.rrcsPri.methodCall(method, [transKey, ...params])
			if (this.config.verbose) {
				this.log(
					'debug',
					`RRCS Primary Server Response to Method Call: ${method}\nTransaction Key: ${transKey} Data: ${JSON.stringify(
						params,
					)}`,
				)
			}
			//this.updateStatus(InstanceStatus.Ok)
		} else {
			this.log('warn', `No RRCS Server. Tried to send ${method} ${params} to ${server ?? this.rrcs.activeServer}`)
			this.updateStatus(InstanceStatus.BadConfig, `No server`)
			return undefined
		}
	} catch (error) {
		this.log('warn', `Error! \n ${JSON.stringify(error)}`)
		this.updateStatus(InstanceStatus.ConnectionFailure, error?.faultString ?? JSON.stringify(error))
		return undefined
	}
	return data
}
