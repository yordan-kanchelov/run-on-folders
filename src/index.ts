import chalk from "chalk";
import * as fs from "fs";
import executeShellCommand from "./utils/executeShellCommand";

const command = process.argv.slice(2).join(" ");

try {
    process.chdir(__dirname);
    console.log(`New directory: ${process.cwd()}`);
} catch (err) {
    console.error(`chdir: ${err}`);
}

(async () => {
    process.chdir(__dirname);
    const files = fs.readdirSync(__dirname);
    const directories = files.filter(path => {
        return fs.statSync(path).isDirectory();
    });

    for (
        let directoryIndex = 0;
        directoryIndex < directories.length;
        directoryIndex++
    ) {
        const directory = directories[directoryIndex];

        console.log(
            chalk.redBright(`
        ${"-".repeat(directory.length + 4)}
        - ${directory} -
        ${"-".repeat(directory.length + 4)}
        `)
        );

        await executeShellCommand(command, { cwd: directory });

        console.log(
            chalk.yellow(`
        ${"-".repeat(32)}    
        `)
        );
    }
})();
