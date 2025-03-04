import { rrcsMethods } from './methods.js'
const keepAliveTimeout = 10000

export async function registerForAllEvents(localPort, localHost, rrcsServer) {
	await this.rrcsQueue.add(async () => {
		this.recievedKeepAlive(localPort, localHost, rrcsServer)
		return await this.rrcsMethodCall(
			rrcsMethods.notifications.registerForAllEvents.rpc,
			[parseInt(localPort), localHost, false, false],
			rrcsServer,
		)
	})
}

export async function unregisterForAllEvents(localPort, localHost, rrcsServer) {
	if (this[`notificationTimer${rrcsServer}`]) {
		clearTimeout(this[`notificationTimer${rrcsServer}`])
		delete this[`notificationTimer${rrcsServer}`]
	}
	await this.rrcsMethodCall(rrcsMethods.notifications.unregisterForAllEvents.rpc, [localPort, localHost], rrcsServer)
}

export function recievedKeepAlive(localPort, localHost, rrcsServer) {
	if (this[`notificationTimer${rrcsServer}`]) {
		clearTimeout(this[`notificationTimer${rrcsServer}`])
	}
	this[`notificationTimer${rrcsServer}`] = setTimeout(() => {
		this.registerForAllEvents(localPort, localHost, rrcsServer)
	}, keepAliveTimeout)
}
