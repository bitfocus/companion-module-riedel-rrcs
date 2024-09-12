import { rrcsMethods } from './methods.js'
const keepAliveTimeout = 10000

export function registerForAllEvents(localPort, localHost, rrcsServer) {
	this.rrcsQueue.add(
		() =>
			this.rrcsMethodCall(
				rrcsMethods.notifications.registerForAllEvents.rpc,
				[parseInt(localPort), localHost, false, false],
				rrcsServer,
			),
		this.recievedKeepAlive(localPort, localHost, rrcsServer),
	)
}

export function unregisterForAllEvents(localPort, localHost, rrcsServer) {
	if (this[`notificationTimer${rrcsServer}`]) {
		clearTimeout(this[`notificationTimer${rrcsServer}`])
		delete this[`notificationTimer${rrcsServer}`]
	}
	this.rrcsMethodCall(rrcsMethods.notifications.unregisterForAllEvents.rpc, [localPort, localHost], rrcsServer)
}

export function recievedKeepAlive(localPort, localHost, rrcsServer) {
	if (this[`notificationTimer${rrcsServer}`]) {
		clearTimeout(this[`notificationTimer${rrcsServer}`])
	}
	this[`notificationTimer${rrcsServer}`] = setTimeout(() => {
		this.registerForAllEvents(localPort, localHost, rrcsServer)
	}, keepAliveTimeout)
}
