export default async function (self) {
	let variableDefs = []
	variableDefs.push({ variableId: 'string', name: 'Recieved String' })
	self.setVariableDefinitions(variableDefs)
}
