import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

const keepAliveTime = 10000

export function startKeepAlive() {
	if (this.keepAliveTimer) {
		clearTimeout(this.keepAliveTimer)
	}
	if (this.rrcsPri) {
		this.sendKeepAlive('pri')
	}
	if (this.rrcsSec) {
		this.sendKeepAlive('sec')
	}
	this.keepAliveTimer = setTimeout(() => {
		this.startKeepAlive()
	}, keepAliveTime)
}

export function stopKeepAlive() {
	if (this.keepAliveTimer) {
		clearTimeout(this.keepAliveTimer)
		delete this.keepAliveTimer
	}
}

export async function sendKeepAlive(rrcsServer) {
	return await this.rrcsQueue.add(async () => {
		const response = await this.rrcsMethodCall(rrcsMethods.status.getAlive.rpc, [], rrcsServer)
		if (response === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `sendKeepAlive: \n${JSON.stringify(response)}`)
		}
		if (response[1] !== 0) {
			this.log('warn', `sendKeepAlive: ${rrcsErrorCodes[response[1]]}`)
			return undefined
		}
		return response
	})
}
