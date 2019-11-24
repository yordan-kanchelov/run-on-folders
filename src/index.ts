import executeShellCommand from "./utils/executeShellCommand";
import listDirectories from "./utils/list-directories";

import CommandOptions from "./command-options";
import promptUser from "./console-interface/promp-user";

let commandOptions: CommandOptions; //process.argv.slice(2).join(" ");

(async () => {
    try {
        process.chdir(__dirname);
    } catch (err) {
        console.error(`chdir: ${err}`);
    }

    if (true) {
        commandOptions = await promptUser();
    } else {
        // TODO
    }

    await Promise.all(
        commandOptions.selectedDirectories.map(directory => {
            return executeShellCommand(commandOptions.command, {
                cwd: directory,
            });
        })
    );
})();
