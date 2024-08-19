import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export function getAllLogicSources() {
	this.rrcsQueue.add(async () => {
		const logicSources = await this.rrcsMethodCall(rrcsMethods.logic.getAllSourcesV2.rpc, [])
		if (logicSources === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `getAllLogicSources: \n${JSON.stringify(logicSources)}`)
		}
		if (logicSources[`ErrorCode`] !== 0) {
			this.log('warn', `getAllXp: ${rrcsErrorCodes[logicSources.ErrorCode]}`)
			return undefined
		}
		if (logicSources[`LogicSourceCount`] > 0) {
			for (let i = 1; i <= logicSources[`LogicSourceCount`]; i++) {
				const logicSource = logicSources[`LogicSource#${i}`]
				if (Array.isArray(logicSource) && logicSource.length === 4) {
					this.rrcs.logicSrc[logicSource[2]] = {
						name: logicSource[0],
						alias: logicSource[1],
						ObjectID: logicSource[2],
						state: !!logicSource[3],
					}
					this.rrcs.choices.logicSources.push({ id: logicSource[2], label: logicSource[0] })
				}
			}
		}
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.checkFeedbacks('logicSource')
	})
}

export function setLogicSource(ObjectID, state) {
	this.rrcsQueue.add(async () => {
		const logicSource = await this.rrcsMethodCall(rrcsMethods.logic.setSource.rpc, [ObjectID, !!state])
		if (logicSource === undefined) {
			return
		}
		if (this.config.verbose) {
			this.log('debug', `setLogicSource: \n${JSON.stringify(logicSource)}`)
		}
		if (logicSource[1] !== 0) {
			this.log('warn', `setLogicSource: ${rrcsErrorCodes[logicSource.ErrorCode]}`)
			return undefined
		} else {
			this.rrcs.logicSrc[ObjectID].state = !!state
			this.checkFeedbacks('logicSource')
		}
	})
}
