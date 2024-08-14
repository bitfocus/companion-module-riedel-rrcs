export const serverCallbacks = {
	initial: function (msg) {
		console.log(msg)
	},
	error: function (msg, err) {
		console.error(msg)
		console.error(err)
	},
	registerForAllEvents: function (msg) {
		console.log(msg)
	},
	crosspointChange: function (params) {
		console.log('crosspointChange')
		console.log(params)
	},
	sendString: function (string) {
		console.log('sendString')
		console.log(string)
	},
}
