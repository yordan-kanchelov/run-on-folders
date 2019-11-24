export default class CommandOptions {
    command: string;
    selectedDirectories: string[];

    /**
     *
     */
    constructor(command: string, selectedDirectories: string[]) {
        this.command = command;
        this.selectedDirectories = selectedDirectories;
    }
}
