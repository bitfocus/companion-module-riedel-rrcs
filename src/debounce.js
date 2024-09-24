const feedbackDebounceTime = 20 //interval between feedback checks
const actionFeedbackDefDebounceTime = 2000
const getAllDebounceTime = 10000

export function debounceUpdateFeedbacks() {
	if (this.feedbackDebounceTimer) {
		clearTimeout(this.feedbackDebounceTimer)
	}
	if (this.feedbacksToUpdate.length > 0) {
		this.checkFeedbacks(...this.feedbacksToUpdate)
		this.feedbacksToUpdate = []
	}
	this.feedbackDebounceTimer = setTimeout(() => {
		this.debounceUpdateFeedbacks()
	}, feedbackDebounceTime)
}

export function debounceUpdateActionFeedbackDefs() {
	if (this.actionFeedbackDefDebounceTimer) {
		clearTimeout(this.actionFeedbackDefDebounceTimer)
	}
	this.actionFeedbackDefDebounceTimer = setTimeout(() => {
		this.updateActionFeedbackDefs()
	}, actionFeedbackDefDebounceTime)
}

export function updateActionFeedbackDefs() {
	if (this.actionFeedbackDefDebounceTimer) {
		clearTimeout(this.actionFeedbackDefDebounceTimer)
		delete this.actionFeedbackDefDebounceTimer
	}
	this.updateActions() // export actions
	this.updateFeedbacks() // export feedbacks
	this.updateVariableDefinitions() // export variable definitions
	if (this.feedbacksToUpdate.includes('portDetails') === false) {
		this.feedbacksToUpdate.push('portDetails')
	}
	this.subscribeActions()
	this.subscribeFeedbacks()
}

export function debounceGetAll() {
	if (this.getAllDebounceTimer) {
		clearTimeout(this.getAllDebounceTimer)
	}
	this.getAllDebounceTimer = setTimeout(() => {
		this.getAllRRCSProps()
	}, getAllDebounceTime)
}

export async function getAllRRCSProps() {
	if (this.getAllDebounceTimer) {
		clearTimeout(this.getAllDebounceTimer)
		delete this.getAllDebounceTimer
	}
	this.getAllXp()
	this.getAllLogicSources()
	this.getAllPorts()
	this.getAllIFBs()
	this.debounceUpdateFeedbacks()
}

export function stopDebounce() {
	if (this.feedbackDebounceTimer) {
		clearTimeout(this.feedbackDebounceTimer)
		delete this.feedbackDebounceTimer
	}
	if (this.actionFeedbackDefDebounceTimer) {
		clearTimeout(this.actionFeedbackDefDebounceTimer)
		delete this.actionFeedbackDefDebounceTimer
	}
	if (this.getAllDebounceTimer) {
		clearTimeout(this.getAllDebounceTimer)
		delete this.getAllDebounceTimer
	}
}
