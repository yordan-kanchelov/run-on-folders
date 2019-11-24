import * as prompts from "prompts";
import CommandOptions from "../command-options";
import listDirectories from "../utils/list-directories";

export default async function(): Promise<CommandOptions> {
    const questions: prompts.PromptObject[] = [
        {
            type: "text",
            name: "command",
            message: "Enter command which will be executed on each folder",
        },
        {
            type: "multiselect",
            name: "selectedDirectories",
            message: "Select desired directories",
            choices: listDirectories(process.cwd()).map(value => {
                return {
                    title: value,
                    value,
                    selected: true,
                };
            }),
        },
    ];

    const prompt = await prompts(questions);

    return new CommandOptions(prompt.command, prompt.selectedDirectories);
}
