export default async function (self) {
	let variableDefs = []
	variableDefs.push({ variableId: 'string', name: 'Recieved String' })
	variableDefs.push({ variableId: 'version', name: 'RRCS Version' })
	variableDefs.push({ variableId: 'configurationID', name: 'Configuration ID' })
	variableDefs.push({ variableId: 'nodeCount', name: 'Number of Nodes' })
	variableDefs.push({ variableId: 'clientCardCount', name: 'Number of Client Cards' })
	self.setVariableDefinitions(variableDefs)
}
