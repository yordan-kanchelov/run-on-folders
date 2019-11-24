#!/usr/bin/env node

import executeShellCommand from "./utils/executeShellCommand";

import CommandOptions from "./command-options";
import promptUser from "./console-interface/promp-user";
import * as yargs from "yargs";
import listDirectories from "./utils/list-directories";

let commandOptions: CommandOptions;
const args = yargs
    .command("command", '"echo replace me with something else"')
    .help().argv;

(async () => {
    if (!args.command) {
        commandOptions = await promptUser();
    } else {
        commandOptions = new CommandOptions(
            args.command as string,
            listDirectories(process.cwd())
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
