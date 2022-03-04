export interface go {
  "main": {
    "App": {
		GetMachineId():Promise<string|Error>
		ReadUserConfig(arg1:string):Promise<string|Error>
		WriteUserConfig(arg1:string,arg2:string):Promise<number|Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
