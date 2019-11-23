import * as fs from "fs";
import * as util from "util";
import chalk from "chalk";
import { exec, ExecOptions } from "child_process";

const command = process.argv.slice(2).join(" ");
const execPromise = util.promisify(exec);

try {
    process.chdir(__dirname);
    console.log(`New directory: ${process.cwd()}`);
} catch (err) {
    console.error(`chdir: ${err}`);
}

(async () => {
    async function executeShellCommand(command: string, options?: ExecOptions) {
        try {
            const { stdout, stderr } = await execPromise(command, options);
            console.log("stdout:", stdout);
            console.log("stderr:", stderr);
        } catch (e) {
            console.error(e);
        }
    }

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

        chalk.redBright(`
            ${"-".repeat(directory.length + 4)}
            - ${directory} -
            ${"-".repeat(directory.length + 4)}
        `);

        await executeShellCommand(command, { cwd: directory });

        chalk.yellow(`
            ${"-".repeat(32)}
            
        `);
    }
})();
