const debounceTime = 40 //interval between feedback checks and variable updates

export function debounceUpdateFeedbacksVariables() {
	if (this.feedbacksToUpdate.length > 0) {
		this.checkFeedbacks(this.feedbacksToUpdate)
		this.feedbacksToUpdate = []
	}
	if (this.variablesToUpdate.length > 0) {
		this.updateVariableValues(this.variablesToUpdate)
		this.variablesToUpdate = []
	}
	this.debounceTimer = setTimeout(() => {
		this.debounceUpdateFeedbacksVariables()
	}, debounceTime)
}

export function stopDebounce() {
	if (this.debounceTimer) {
		clearTimeout(this.debounceTimer)
		delete this.debounceTimer
	}
}
