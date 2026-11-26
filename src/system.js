import { orderBy } from 'lodash-es'

import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export async function getVersion() {
	return await this.rrcsQueue.add(async () => {
		const response = await this.rrcsMethodCall(rrcsMethods.status.getVersion.rpc, [])
		if (response === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getVersion: \n${JSON.stringify(response)}`)
		}
		if (response[1] !== 0) {
			this.log('warn', `getVersion: ${rrcsErrorCodes[response[1]]}`)
			return undefined
		}
		this.rrcs.version = response[2]
		this.setVariableValues({ version: response[2] })
		return response[2]
	})
}

export async function getConfigurationID() {
	return await this.rrcsQueue.add(async () => {
		const response = await this.rrcsMethodCall(rrcsMethods.status.getConfigurationID.rpc, [])
		if (response === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getConfigurationID: \n${JSON.stringify(response)}`)
		}
		if (response[1] !== 0) {
			this.log('warn', `getConfigurationID: ${rrcsErrorCodes[response[1]]}`)
			return undefined
		}
		this.rrcs.configurationID = response[2]
		this.setVariableValues({ configurationID: response[2] })
		return response[2]
	})
}

export async function getAllNodes() {
	return await this.rrcsQueue.add(async () => {
		const nodes = await this.rrcsMethodCall(rrcsMethods.status.getAllNodes.rpc, [])
		if (nodes === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllNodes: \n${JSON.stringify(nodes)}`)
		}
		if (!Array.isArray(nodes[1])) {
			this.log('warn', `Invalid response to getAllNodes. \n${JSON.stringify(nodes)}`)
			return undefined
		}
		this.rrcs.nodes = nodes[1]
		this.rrcs.choices.nodes = orderBy(
			nodes[1]
				.filter((node) => node.ObjectID !== undefined)
				.map((node) => {
					return { id: node.ObjectID, label: node.LongName ?? `Node ${node.NodeAddress}` }
				}),
			['label'],
			['asc'],
		)
		this.setVariableValues({ nodeCount: nodes[1].length })
		return nodes[1]
	})
}

export async function getAllClientCards(node = -1) {
	return await this.rrcsQueue.add(async () => {
		const clientCards = await this.rrcsMethodCall(rrcsMethods.status.getAllClientCards.rpc, [node])
		if (clientCards === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllClientCards: \n${JSON.stringify(clientCards)}`)
		}
		if (!Array.isArray(clientCards[1])) {
			this.log('warn', `Invalid response to getAllClientCards. \n${JSON.stringify(clientCards)}`)
			return undefined
		}
		this.rrcs.clientCards = clientCards[1]
		this.setVariableValues({ clientCardCount: clientCards[1].length })
		return clientCards[1]
	})
}
