export function recieveString(response) {
    if(!Array.isArray(response) || response.length !== 2){
        if (this.config.verbose) {
            this.log(`debug`, `recieveString expected an array of length 2, recieved: ${response}`)
        }
        return undefined
    }
    let variablesToUpdate = []
    variablesToUpdate['string'] = response[1]
    this.setVariableValues(variablesToUpdate)
    
}