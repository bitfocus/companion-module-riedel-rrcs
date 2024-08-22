const debounceTime = 20 //interval between feedback checks and variable updates

export function debounceUpdateFeedbacks() {
	if (this.debounceTimer) {
		clearTimeout(this.debounceTimer)
	}
	if (this.feedbacksToUpdate.length > 0) {
		this.checkFeedbacks(...this.feedbacksToUpdate)
		this.feedbacksToUpdate = []
	}
	this.debounceTimer = setTimeout(() => {
		this.debounceUpdateFeedbacks()
	}, debounceTime)
}

export function stopDebounce() {
	if (this.debounceTimer) {
		clearTimeout(this.debounceTimer)
		delete this.debounceTimer
	}
}
