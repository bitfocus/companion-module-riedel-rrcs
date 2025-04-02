import { orderBy } from 'lodash-es'

import { rrcsMethods } from './methods.js'
import { rrcsErrorCodes } from './errorcodes.js'

export async function getAllConferences() {
	return await this.rrcsQueue.add(async () => {
		const conferences = await this.rrcsMethodCall(rrcsMethods.objects.getList.rpc, ['conference'])
		if (conferences === undefined) {
			return
		}
		this.log('info', `getAllConferences: \n${JSON.stringify(conferences)}`)
		if (this.config.verbose) {
			this.log('debug', `getAllConferences: \n${JSON.stringify(conferences)}`)
		}
		if (conferences[`ErrorCode`] !== undefined && conferences[`ErrorCode`] !== 0) {
			this.log('warn', `getAllConferences: ${rrcsErrorCodes[conferences.ErrorCode]}`)
			return undefined
		}
		if (Array.isArray(conferences.ObjectList)) {
			this.rrcs.choices.conferences = []
			for (const conference of conferences.ObjectList) {
				if (Object.keys(conference).includes('LongName') && Object.keys(conference).includes('ObjectID')) {
					this.rrcs.choices.conferences.push({ id: conference.ObjectID, label: conference.LongName })
				}
			}
			this.rrcs.choices.conferences = orderBy(this.rrcs.choices.conferences, ['label'], ['asc'])
		}
		return conferences.ObjectList
	})
}

export async function editConference(conferenceId, params) {
	const id = Math.round(Number(conferenceId))
	if (isNaN(id)) return
	const SpecificParams = {
		ObjectID: id,
	}

	if (params.alias !== undefined) {
		SpecificParams.Alias = params.alias.toString().substring(0, 8)
	}
	if (params.label !== undefined) {
		SpecificParams.Label = params.label.toString().substring(0, 8)
	}
	if (params.longName !== undefined) {
		SpecificParams.LongName = params.longName.toString().substring(0, 32)
	}
	if (Object.keys(SpecificParams).length == 1) return undefined
	const args = {
		ChangeType: rrcsMethods.configuration.configurationChangeEx.changeType.edit.id,
		ObjectType: rrcsMethods.configuration.configurationChangeEx.objectType.conference.id,
		SpecificParams: SpecificParams,
	}

	return await this.rrcsQueue.add(async () => {
		const conf = await this.rrcsMethodCall(rrcsMethods.configuration.configurationChangeEx.rpc, [[args]])
		this.log('info', `edit conference response: ${JSON.stringify(conf)}`)
		return conf
	})
}

export async function getConference(conferenceId) {
	return await this.rrcsQueue.add(async () => {
		const conferenceProps = await this.rrcsMethodCall(rrcsMethods.objects.getProperty.rpc, [conferenceId, ''])
		this.log('info', `Conference ${conferenceId} Properties: ${JSON.stringify(conferenceProps)}`)
		return conferenceProps
	})
}
