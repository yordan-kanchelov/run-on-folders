import chalk from "chalk";
import { exec, ExecOptions } from "child_process";
import * as util from "util";
import * as log from "fancy-log";

const execPromise = util.promisify(exec);

export default async function executeShellCommand(command: string, options: ExecOptions): Promise<void> {
    log(chalk.red(`EXECUTING -  ${command} on ${options.cwd}`));

    try {
        const { stdout, stderr } = await execPromise(command, options);
        log(`${chalk.red(`[${options.cwd}]`)} stdout:`, stdout);
        log(`${chalk.red(`[${options.cwd}]`)} stderr:`, stderr);
    } catch (e) {
        log.error(`${chalk.red(`[${options.cwd}]`)} exception:`, e);
    }
}
