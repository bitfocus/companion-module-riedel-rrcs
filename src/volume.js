import { rrcsErrorCodes } from './errorcodes.js'
import { rrcsMethods } from './methods.js'

export async function setXPVolume(src, dst, single, conference, volume) {
	const cleanVolume = volume * 2 + 230 > 255 ? 255 : volume * 2 + 230 <= 0 ? 0 : parseInt(volume * 2 + 230)
	if (isNaN(cleanVolume)) {
		return undefined
	}

	return await this.rrcsQueue.add(async () => {
		const response = await this.rrcsMethodCall(rrcsMethods.volume.setXp, [
			src.net,
			src.node,
			src.port,
			dst.net,
			dst.node,
			dst.port,
			single,
			conference,
			cleanVolume,
		])
		if (response === undefined) {
			return undefined
		}
		if (this.config.verbose) {
			this.log('debug', `setIOGain: \n${JSON.stringify(response)}`)
		}
		if (response[1] !== 0) {
			this.log('warn', `setIOGain: ${rrcsErrorCodes[response[1]]}`)
			return undefined
		} else {
			return cleanVolume
		}
	})
}
