export function returnTransKey() {
	if (this.transKey === undefined) {
		this.transKey = 0
	} else if (this.transKey >= 9999999999) {
		this.transKey = 0
	} else {
		this.transKey = this.transKey + 1
	}
	return 'C' + this.transKey.toString().padStart(10, '0')
}
