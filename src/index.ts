#!/usr/bin/env node

import executeShellCommand from "./utils/executeShellCommand";

import CommandOptions from "./command-options";
import promptUser from "./console-interface/promp-user";
import * as yargs from "yargs";
import listDirectories from "./utils/list-directories";

const args = yargs
    .command(
        "run",
        "Executes the specified command in selected directories",
        yargs => {
            return yargs.option("cmd", {
                describe: "The command to execute",
                type: "string",
                demandOption: true, // makes the command argument required
                alias: "c",
            });
        }
    )
    .help().argv;

(async () => {
    let commandOptions: CommandOptions;
    console.log(args);
    if (!args.c) {
        commandOptions = await promptUser();
    } else {
        commandOptions = new CommandOptions(
            args.command as string,
            listDirectories(process.cwd()).filter(value => {
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
        commandOptions.selectedDirectories.map(directory => {
            return executeShellCommand(commandOptions.command, {
                cwd: directory,
            });
        })
    );
})();
