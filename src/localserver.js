import { InstanceStatus } from '@companion-module/base'
import { XmlRpcServer } from '@foxglove/xmlrpc'
import { HttpServerNodejs } from '@foxglove/xmlrpc/nodejs'

import { notifications } from './notifications.js'

export async function initLocalServer(port, host, name, rrcsServer) {
	this[name] = new XmlRpcServer(new HttpServerNodejs())
	await this[name].listen(port, host)
	this.registerForAllEvents(port, host, rrcsServer)
	if (this.config.verbose) {
		this.log('debug', `${name} listening on ${this[name].url()}`)
	}
	this[name].setHandler(notifications.string.send.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.recieveString(args)
	})
	this[name].setHandler(notifications.string.sendOff.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.recieveStringOff(args)
	})
	this[name].setHandler(notifications.gpio.inputChange.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		if (args.length === 7) {
			this.addGPI({ net: args[1], node: args[2], port: args[3], slot: args[4], number: args[5] }, args[6])
		}
	})
	this[name].setHandler(notifications.gpio.outputChange.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		if (args.length === 7) {
			this.addGPO({ net: args[1], node: args[2], port: args[3], slot: args[4], number: args[5] }, args[6])
		}
	})
	this[name].setHandler(notifications.logic.sourceChange.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.addLogicSource(args[1], args[2])
	})
	this[name].setHandler(notifications.volume.xpChange.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this[name].setHandler(notifications.configuration.change.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		if (this.config.update) {
			this.debounceGetAll()
		}
	})
	this[name].setHandler(notifications.crosspoint.change.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('debug', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		const xpoints = args[2]
		for (const xpt in xpoints) {
			this.log('info', `${xpt}: ${xpoints[xpt]}`)
			const data = xpoints[xpt]
			if (data.length !== 7) {
				break
			}
			this.addCrosspoint(
				{ net: parseInt(data[0]), node: parseInt(data[1]), port: parseInt(data[2]) },
				{ net: parseInt(data[3]), node: parseInt(data[4]), port: parseInt(data[5]) },
				!!data[6]
			)
		}
	})
	this[name].setHandler(notifications.alarms.upstreamFailed.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('warn', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.UnknownWarning, JSON.stringify(args))
	})
	this[name].setHandler(notifications.alarms.upstreamFailedCleared.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('info', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.Ok)
	})
	this[name].setHandler(notifications.alarms.downstreamFailed.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('warn', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.UnknownWarning, JSON.stringify(args))
	})
	this[name].setHandler(notifications.alarms.downstreamFailedCleared.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('info', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.Ok)
	})
	this[name].setHandler(notifications.alarms.nodeControllerFailed.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('warn', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.UnknownWarning, JSON.stringify(args))
	})
	this[name].setHandler(notifications.alarms.nodeControllerReboot.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('warn', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.UnknownWarning, JSON.stringify(args))
	})
	this[name].setHandler(notifications.alarms.clientFailed.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('warn', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.UnknownWarning, JSON.stringify(args))
	})
	this[name].setHandler(notifications.alarms.clientFailedCleared.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('info', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.Ok)
	})
	this[name].setHandler(notifications.alarms.portInactive.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('warn', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this[name].setHandler(notifications.alarms.portActive.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('info', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
	})
	this[name].setHandler(notifications.alarms.connectArtistRestored.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('info', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.Ok)
	})
	this[name].setHandler(notifications.alarms.connectArtistFailure.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('warn', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.UnknownWarning, JSON.stringify(args))
	})
	this[name].setHandler(notifications.alarms.gatewayShutdown.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			this.log('error', `${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.updateStatus(InstanceStatus.UnknownError, JSON.stringify(args))
	})
	this[name].setHandler(notifications.ping.getAlive.rpc, async (methodName, args) => {
		if (this.config.verbose) {
			console.log(`${name} Recieved: ${methodName} Data: ${JSON.stringify(args)}`)
		}
		this.recievedKeepAlive(port, host, rrcsServer)
	})
}
