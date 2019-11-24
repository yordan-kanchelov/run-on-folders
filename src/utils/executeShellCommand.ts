import { exec, ExecOptions } from "child_process";
import * as util from "util";

const execPromise = util.promisify(exec);

export default async function executeShellCommand(
    command: string,
    options?: ExecOptions
): Promise<void> {
    try {
        const { stdout, stderr } = await execPromise(command, options);
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
    } catch (e) {
        console.error("stderr:", e);
    }
}
