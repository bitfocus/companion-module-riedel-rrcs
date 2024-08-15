import { XmlRpcFault, XmlRpcServer } from '@foxglove/xmlrpc'
import { HttpServerNodejs } from '@foxglove/xmlrpc/nodejs'

import { notifications } from './notifications.js'

export async function initLocalServer(port, host) {
	this.localXmlRpc = new XmlRpcServer(new HttpServerNodejs())
	await this.localXmlRpc.listen(port, host)
    if (this.config.verbose){
        this.log('debug', `Listening on ${this.localXmlRpc.url()}`)
    }
	this.localXmlRpc.setHandler(notifications.string.send.rpc, async (methodName, args, req) => {
        if (this.config.verbose){
            this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
        }
	})
	this.localXmlRpc.setHandler(notifications.string.sendOff.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.gpio.inputChange.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.gpio.outputChange.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.logic.sourceChange.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.volume.xpChange.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.configuration.change.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.crosspoint.change.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
        const xpoints = args[2]
        for (const xpt in xpoints) {
			this.log('info', xpt )
            this.log('info', xpoints[xpt])
            const data = xpoints[xpt]
            if (data.length !== 7) { break }
            this.rrcs.crosspoint[parseInt(data[0])][parseInt(data[1])][parseInt(data[2])][parseInt(data[3])][parseInt(data[4])][parseInt(data[5])] = !!data[6]
		}
        this.checkFeedbacks('crosspoint')
	})
	this.localXmlRpc.setHandler(notifications.alarms.upstreamFailed.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('warn', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.upstreamFailedCleared.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('info', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.downstreamFailed.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('warn', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.downstreamFailedCleared.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('info', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.nodeControllerFailed.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('warn', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.nodeControllerReboot.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('warn', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.clientFailed.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('warn', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.clientFailedCleared.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('info', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.portInactive.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('warn', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.portActive.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('info', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.connectArtistRestored.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('info', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.connectArtistFailure.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('warn', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.alarms.gatewayShutdown.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			this.log('error', `Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this.localXmlRpc.setHandler(notifications.ping.getAlive.rpc, async (methodName, args, req) => {
		if (this.config.verbose) {
			console.log(`Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
}

export async function rrcsMethodCallQueue(method, params) {
	let data

	try {
		data = await this.rrcsPri.methodCall(method, [this.returnTransKey(), ...params])
		return data
	} catch (error) {
		console.log(`Error! \n ${JSON.stringify(error)}`)
		data = undefined
	}

	return data
}
