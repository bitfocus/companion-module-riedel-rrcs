import { pull } from 'lodash-es'

export function recieveString(response) {
	if (!Array.isArray(response) || response.length !== 2) {
		if (this.config.verbose) {
			this.log(`debug`, `recieveString expected an array of length 2, recieved: ${response}`)
		}
		return undefined
	}
	let variablesToUpdate = []
	variablesToUpdate['string'] = response[1]
	this.setVariableValues(variablesToUpdate)
	this.rrcs.strings.push(response[1])
	if (this.feedbacksToUpdate.includes('string') === false) {
		this.feedbacksToUpdate.push('string')
	}
}

export function recieveStringOff(response) {
	if (!Array.isArray(response) || response.length !== 2) {
		if (this.config.verbose) {
			this.log(`debug`, `recieveStringOff expected an array of length 2, recieved: ${response}`)
		}
		return undefined
	}
	pull(this.rrcs.strings, response[1])
	if (this.feedbacksToUpdate.includes('string') === false) {
		this.feedbacksToUpdate.push('string')
	}
}
