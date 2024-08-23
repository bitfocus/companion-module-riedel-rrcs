import { orderBy } from 'lodash-es'

import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export function setIFBVolume(method, addr, isInput, ifbNumber, volume) {
	const cleanVolume = volume * 2 + 230 > 255 ? 255 : volume * 2 + 230 <= 0 ? 0 : parseInt(volume * 2 + 230)
	const ifb = parseInt(ifbNumber)
	const keys = Object.keys(addr)
	if ((isNaN(cleanVolume) && method === rrcsMethods.ifbVolume.set.rpc) || isNaN(ifb)) {
		return undefined
	}
	if (keys.includes('node') && keys.includes('port')) {
        const data = method === rrcsMethods.ifbVolume.set.rpc ? [addr.node, addr.port, isInput, ifb, cleanVolume] : [addr.node, addr.port, isInput, ifb]
		this.rrcsQueue.add(async () => {
			const response = await this.rrcsMethodCall(method, data)
			if (this.config.verbose) {
				this.log('debug', `${method} response: ${response}`)
			}
            if (method === rrcsMethods.ifbVolume.remove.rpc) {
                if (Array.isArray(response)) {
                    if (response[1] !== 0) {
                        this.log(
                            'warn',
                            `RemoveIFBVolumeMixMinus Error: ${rrcsErrorCodes[response[1]]} address: ${JSON.stringify(addr)} ifb: ${ifb}`
                        )
                    }
                }
            }
		})
	}
}

export function getAllIFBs() {
	this.rrcsQueue.add(async () => {
		const ifbs = await this.rrcsMethodCall(rrcsMethods.status.getAllIFBs.rpc, [])
		if (ifbs === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllXP: \n${JSON.stringify(ifbs)}`)
		}
        if (Array.isArray(ifbs[1])) {
			this.rrcs.ifbs = []
			for (const ifb of ifbs[1]) {
				this.rrcs.ifbs[`${ifb.ObjectID}`] = ifb
			}
			this.buildIFBChoices(ifbs[1])
		} else {
			this.low('warn', `Invalid response to getAllIFBs. \n${JSON.stringify(ifbs)}`)
		}
	})
}

export function buildIFBChoices(ifbArray) {
	if (!Array.isArray(ifbArray)) {
		this.log('warn', `buildIFBChoices has been passed invalid data`)
		return undefined
	}
	this.rrcs.choices.ifbs = []

    for (const ifb of ifbArray) {
		this.rrcs.choices.ifbs.push({ id: ifb.ObjectID, label: ifb.LongName })
	}
	this.rrcs.choices.ifbs = orderBy(this.rrcs.choices.ifbs, ['label'], ['asc'])
	this.updateActions() // export actions
}

export function getIFBAddressFromObjectID(ObjectID) {
	if (this.rrcs.ifbs[ObjectID] === undefined) {
		return undefined
	}
	const keys = Object.keys(this.rrcs.ifbs[ObjectID])
	if (keys.includes('Number')) {
		return parseInt(this.rrcs.ifbs[ObjectID].Number)
	}
	return undefined
}