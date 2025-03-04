import { rrcsMethods } from './methods.js'
//import { rrcsErrorCodes } from './errorcodes.js'

export async function portClone(method, monitorPort, isInput, isInputClonePort, clonePort) {
	if (method !== rrcsMethods.portClone.start && method !== rrcsMethods.portClone.stop)
		return await this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(method, [
				monitorPort.node,
				monitorPort.port,
				!!isInput,
				clonePort.node,
				clonePort.port,
				!!isInputClonePort,
			])
			if (response === undefined) {
				return
			}
			if (this.config.verbose) {
				this.log('debug', `portClone: \n${JSON.stringify(response)}`)
			}
			return response
		})
}
