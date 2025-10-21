#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import CommandOptions from "./command-options";
import promptUser from "./console-interface/promp-user";
import executeShellCommand from "./utils/executeShellCommand";
import listDirectories from "./utils/list-directories";

const args = yargs(hideBin(process.argv))
    .command(
        "run",
        "Executes the specified command in selected directories",
        (yargs) => {
            return yargs.option("cmd", {
                describe: "The command to execute",
                type: "string",
                demandOption: true,
                alias: "c",
            });
        }
    )
    .help().argv;

(async (): Promise<void> => {
    let commandOptions: CommandOptions;
    const resolvedArgs = await args;
    console.log(resolvedArgs);
    if (!resolvedArgs.cmd) {
        commandOptions = await promptUser();
    } else {
        commandOptions = new CommandOptions(
            resolvedArgs.cmd as string,
            listDirectories(process.cwd()).filter((value) => {
                const ignoreByDefault = [
                    "node_modules",
                    ".git",
                    ".vscode",
                    ".github",
                ];

                return ignoreByDefault.includes(value) ? false : true;
            })
        );
    }

    await Promise.all(
        commandOptions.selectedDirectories.map((directory) => {
            return executeShellCommand(commandOptions.command, {
                cwd: directory,
            });
        })
    );
})();
